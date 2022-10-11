// cd packages/file-runner
// cargo run "../**/*.mjs"

use glob::glob;
use std::io::Write;

// TODO: Make CLI option
const THREAD_POOL_SIZE: u32 = 5;

fn main() {
    // TODO: Make CLI option
    let worker_path = "./src/worker.mjs";

    let pattern = std::env::args()
        .skip(1)
        .next()
        .expect("No pattern provided e.g. \"**/*.rs\"");

    let mut files: Vec<String> = vec![];

    for path_result in glob(&pattern).expect("Failed to read glob pattern") {
        match path_result {
            Err(err) => panic!("{err}"),
            Ok(path) => {
                let absolute_path = std::fs::canonicalize(&path)
                    .unwrap()
                    .into_os_string()
                    .into_string()
                    .unwrap();

                files.push(absolute_path);
            }
        }
    }

    let mut chunked_files: Vec<Vec<String>> = vec![];

    let chunk_size = (files.len() / THREAD_POOL_SIZE as usize) + 1;

    for files_chunk in files.chunks(chunk_size) {
        chunked_files.push(files_chunk.to_vec());
    }

    let mut children = vec![];

    for _i in 0..THREAD_POOL_SIZE {
        let files_chunk = chunked_files.pop().unwrap();

        children.push(std::thread::spawn(move || {
            let formatted_files_chunk: Vec<String> = files_chunk
                .iter()
                .map(|file_path: &String| {
                    if file_path != files_chunk.last().unwrap() {
                        format!("{}\n", file_path.clone())
                    } else {
                        file_path.to_string()
                    }
                })
                .collect();

            let chunked_io_slices: Vec<std::io::IoSlice> = formatted_files_chunk
                .iter()
                .map(|s| std::io::IoSlice::new(s.as_bytes()))
                .collect();

            let mut child = std::process::Command::new("node")
                .arg(worker_path)
                .stdin(std::process::Stdio::piped())
                .stdout(std::process::Stdio::inherit())
                .spawn()
                .unwrap();

            match child
                .stdin
                .as_mut()
                .unwrap()
                .write_vectored(&chunked_io_slices)
            {
                Err(why) => panic!("Couldn't write to child process stdin: {why}"),
                Ok(_) => println!("Sent files to child process"),
            }

            child.wait().unwrap()
        }));
    }

    for child in children {
        child.join().unwrap();
    }
}

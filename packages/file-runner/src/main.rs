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

    let files: Vec<String> = glob(&pattern)
        .expect("Failed to read glob pattern")
        .into_iter()
        .map(|path| {
            std::fs::canonicalize(path.unwrap())
                .unwrap()
                .into_os_string()
                .into_string()
                .unwrap()
        })
        .collect();

    let chunk_size = (files.len() / THREAD_POOL_SIZE as usize) + 1;

    let mut chunked_files: Vec<Vec<String>> = files
        .chunks(chunk_size)
        .map(|files_chunk| files_chunk.to_vec())
        .collect();

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
                .map(|formatted_file| std::io::IoSlice::new(formatted_file.as_bytes()))
                .collect();

            let mut child = std::process::Command::new("node")
                .arg(worker_path)
                .stdin(std::process::Stdio::piped())
                .stdout(std::process::Stdio::inherit())
                .spawn()
                .unwrap();

            child
                .stdin
                .as_mut()
                .unwrap()
                .write_vectored(&chunked_io_slices)
                .expect("Failed to write file paths to stdin");

            child.wait().unwrap()
        }));
    }

    for child in children {
        child.join().unwrap();
    }
}

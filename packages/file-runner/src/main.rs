// cd packages/file-runner
// cargo run src/processor.mjs "../**/*.mjs"

use glob::glob;
use std::io::Write;

// TODO: Make CLI option
const THREAD_POOL_SIZE: usize = 5;

fn main() {
    // TODO: Make CLI option
    let worker_path = "./src/worker.mjs";

    let mut args = std::env::args().skip(1);

    let processor_path = args.next().expect("No processor path provided");
    let processor_path = std::fs::canonicalize(processor_path)
        .unwrap()
        .into_os_string()
        .into_string()
        .unwrap();

    let pattern = args.next().expect("No pattern provided e.g. \"**/*.rs\"");

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

    let num_of_files = files.len();

    println!("Found {num_of_files} files\n");

    let chunk_size = num_of_files / THREAD_POOL_SIZE;
    let chunk_size = if chunk_size == 0 || chunk_size % 2 != 0 {
        chunk_size + 1
    } else {
        chunk_size
    };

    let mut chunked_files: Vec<Vec<String>> = files
        .chunks(chunk_size)
        .map(|files_chunk| files_chunk.to_vec())
        .collect();

    let mut children = vec![];

    for _ in 0..chunked_files.len() {
        let files_chunk = chunked_files.pop().unwrap();
        let processor_path = processor_path.clone();

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
                .arg(processor_path)
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

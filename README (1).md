# YouTube Poop Extra Online Editor

A feature-rich online video editor built with JavaScript, [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm), and CSS.  
This editor allows you to upload and remix multiple videos, images, and audio files directly in your browser, with no server required.  
The project is hosted on [GitHub Pages](https://pages.github.com/), so you can use it online at:  
`https://<your-username>.github.io/<repo-name>/`

## Features

- **Multi-source editing:** Add multiple videos, images, and audio tracks.
- **Browser-based:** All processing happens in your browser using [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm).
- **Remix and export:** Combine sources, remix, and export your final video.
- **No install required:** Works on most modern browsers, including Chrome and Firefox.
- **Free & Open Source:** MIT-licensed and fully hosted on GitHub Pages.

## How to Use

1. **Clone or Fork this repo**  
   Download or fork this repository to your own GitHub account.

2. **Enable GitHub Pages**  
   Go to your repository settings → Pages → Source: main branch, root directory (`/`).

3. **Open the Editor**  
   Visit `https://<your-username>.github.io/<repo-name>/` in your browser.

4. **Add Media**  
   - Upload video files, images, and audio files using the provided file inputs.
   - Preview your sources in the main area.

5. **Edit & Remix**  
   - Click "Start Editing" to prepare your sources.
   - Click "Export Remix Video" to generate your combined video.

6. **Download Output**  
   - Once export is finished, download your remix video from the provided link.

## Project Structure

```
index.html         # Main HTML page
styles.css         # Styling for the editor
script.js          # Main JavaScript logic (uses ffmpeg.js)
README.md          # This file
```

## Technical Details

- **ffmpeg.js** ([ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)) is used for all media processing.
- Video and image sources are concatenated; images are converted to short video clips.
- Audio sources are merged and mixed with the video.
- All processing is client-side; no files are uploaded to any server.

## Development

You can customize and extend this project:
- Add features like timeline editing, transition effects, or advanced audio mixing.
- Adjust default durations and output settings in `script.js`.
- Style the editor to your preference with `styles.css`.

## License

MIT License – see [LICENSE](LICENSE) for details.

## Credits

- [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm) by ffmpeg.wasm contributors
- [GitHub Pages](https://pages.github.com/)
# Are.na Batch Uploader

> A tool that takes your cute lil `JSON` file and batch uploads its contents as blocks to an [are.na](are.na) channel.

## **Requirements**: Hold ya damn horsies

> **⚠️ An important request**: Please don't be a butt-faced weirdo and abuse this tool by spamming open are.na channels. If you do, god _(and [me](https://github.com/egstad))_ will find out, this repo will be forced to go private, and a small corner of hell will be reserved specifically for your foolish soul. **Please don't ruin this for us. _Thank yew!_**

Now that that's out of the way...

To use this tool, you'll only need one thing: a properly formatted `json` file. What's the format? Easy... an array of objects. What's the shape of those objects you might ask?...

```json
[
  {
    "title": "title here!",
    "description": "add text here!",
    "content": "add a url or text here!"
  },
  ... more objects
]
```

Are.na keeps things simple by offering only three inputs for us. A `title`, a `description`, and then a field for `content`. Here's a bit more info taken from [their docs](https://dev.are.na/)

| Name          | Accepted Types     | Description                                                                |
| ------------- | ------------------ | -------------------------------------------------------------------------- |
| `title`       | `String` or `null` | The title of the block                                                     |
| `description` | `String` or `null` | This is used for captioning any type of block. Returns markdown.           |
| `content`     | `String` or `null` | If the block is of class "Text", this will be the text content as markdown |

## **Install**: Alright buddy, let's do this thing

```bash
# clone repo
git clone https://github.com/egstad/arena-batch-uploader.git

# install dependencies
npm install

# run the development server
npm run dev
```

## Techincal Notes

This was built with Node v20.5.0 (npm v9.8.0).

### Libraries Used

- [Vite](https://github.com/vitejs/vite): Dev server and build tool.
- [Arena-js](https://github.com/ivangreene/arena-js): A javascript wrapper for the are.na api, built by [@ivangreene](https://github.com/ivangreene) (thanks, mate!)
- [Fuse.js](https://github.com/krisk/Fuse): Lightweight fuzzy-search.

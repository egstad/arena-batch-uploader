# Are.na Batch Uploader

> A tool that takes your cute lil `JSON` file and batch uploads its contents as blocks to an [are.na](are.na) channel.

[!["Are.na Batch Uploader](https://egstad.link/images/arena-batch-uploader/og.png)](https://arena-batch-uploader.netlify.app/ "Are.na Batch Uploader")

## **Requirements**: Hold ya damn horsies

> **⚠️ An important request**: Please don't be a butt-faced weirdo and abuse this tool by spamming open are.na channels. If you do, god _(and [me](https://github.com/egstad))_ will find out, this repo will be forced to go private, and a small corner of hell will be reserved specifically for your foolish soul. **Please don't ruin this for us. _Thank yew!_**

Now that that's out of the way... To use this tool, you'll only need one thing: a properly formatted `json` file. What's the format? Easy... an array of objects. What's the shape of those objects you might ask?...

```json
[
  {
    "title": "title here!",
    "description": "text here!",
    "content": "url/text here!"
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

## Step-by-step walkthrough

[![Are.na Batch Uploader: 101](https://raw.githubusercontent.com/egstad/arena-batch-uploader/main/public/walkthrough-thumbnail.png?token=GHSAT0AAAAAACGESEPEE6KAYRVJZCMNUCKUZG32D5Q)](https://www.loom.com/share/d1251cffa4674af99dd64eafc61810d2?sid=08c32871-7ba7-40bf-b19b-28079fa17bfb "Are.na Batch Uploader: 101")

## Techincal Notes

This was built with Node `v20.5.0` (npm `v9.8.0`).

### Libraries Used

- [Vite](https://github.com/vitejs/vite): Dev server and build tool.
- [Arena-js](https://github.com/ivangreene/arena-js): A javascript wrapper for the are.na api, built by [@ivangreene](https://github.com/ivangreene) (thanks, mate!)
- [Naive UI](https://github.com/tusen-ai/naive-ui): A Vue 3 Component Library.

## So, why does this tool exist anyways?

Ummm hi, me [Jordan Egstad](https://github.com/egstad) name-o. I'm a [designerd](https://egstad.com) who enjoys finding, collecting, and sharing things on the web for others to enjoy. Once upon a time I found myself with a few thousand images that I wanted to add to my are.na. Sure, I could have dragged and dropped them into a channel (I did), but I quickly noticed that a key artifact was lost: credit to the original sources. Very bad, no good! Contributing credit where credit is due is important! Entering these citations would have taken me days, so I spent an afternoon to make this instead. Is it helpful? Yes. Was it fun to make? Sorta. Is it ugly? Kinda but I like it!.

Pro tip: I'd recommend using python to take your data and shape it into the JSON format listed above. It'll make quick work of a large dataset — whether its a `csv`, `txt`, etc. Maybe you haven't used python before. If so, I promise you can learn enough to be dangerous in an afternoon. I'm living proof.

Hope this is somehow helpful to you. Toodles!

Egstad

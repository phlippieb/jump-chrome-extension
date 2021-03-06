![jump logo](https://vectr.com/phlippieb/aMqBxHexN.svg?width=520&height=220&select=l1alnoeG6m,a25UVsnUyZ,bWnXn95mn&source=selection)

Jump is a Chrome extension that lets you jump to URLs. It's like bookmarks, but _really fast_.

## Installation

**jump** is [available on the Chrome Web Store](https://chrome.google.com/webstore/detail/jump/gbpdkldokkhflcfnijkdfkhfommfalnk/related).

## Usage

**jump** is an omnibox extension, which means it lives in your address bar.

### Activating jump mode

To activate **jump**:
- Make sure the address bar is focused. 
- Type `j`, followed by a space.
- That's it! You should see the jump logo pop up in the search bar.

> Tip: learn a [shortcut key](https://support.google.com/chrome/answer/157179?hl=en) for focusing the address bar. My favourite is `cmd + l`.

<img width="374" alt="Screenshot 2020-04-10 at 19 10 17" src="https://user-images.githubusercontent.com/2232699/79009237-58ca8b80-7b5f-11ea-964c-393e08905957.png">

Once **jump** is activated, you can either jump to one of your URLs, or go to the options page. If you have just installed **jump**, you will want to go the options page first.

## Options page

Go to the options page by typing `,` in **jump**-mode.

> Hint: You can also go to the options page by pressing `enter` whenever **jump** can't find a URL for the text you entered. Watch the suggestion underneath the address bar; if it says "Edit jump options", you can simply press enter.

The options page basically lets you manage your URLs. Here you can:
- Add a new URL under the "Register a new URL" section
- Remove existing URLs from the "Registered URLs" section

Registered URLs consist of a **keyword** and a **URL**. The keyword is the part that you will type when you are **jump** mode, to jump to the URL.

To add a new URL, choose a keyword and type it into the _keyword_ field. Paste the URL into the _URL_ field. Then click on the _Add_ button.

<img width="794" alt="Screenshot 2020-04-10 at 19 14 56" src="https://user-images.githubusercontent.com/2232699/79009375-94655580-7b5f-11ea-96f4-1a30d9ebc2d1.png">

To remove a URL, simply click on the _Remove_ button next to it.

<img width="815" alt="Screenshot 2020-04-10 at 19 16 27" src="https://user-images.githubusercontent.com/2232699/79009474-ca0a3e80-7b5f-11ea-9d87-6533e086763e.png">

> Tip: Keep your keywords distinct. You only need to type part of a keyword to select it, but the fewer characters you need to type to get the URL you want, the faster you become.

Once you have registered some URLs, you're all set to start using **jump**.

## Jumping

To jump to a registered URL, simply type its keyword while in **jump** mode. As you type, the top suggestion will indicate which registered URL is selected. You'll notice that you don't have to type the complete keyword.

<img width="629" alt="Screenshot 2020-04-10 at 19 19 06" src="https://user-images.githubusercontent.com/2232699/79009640-43099600-7b60-11ea-87dd-7b37207970fc.png">

With a URL selected as the top result, simply press `enter` to jump to it!

You can also use the arrow keys to move up and down between suggestions. However, if you find yourself doing this a lot,  your keywords might benefit from some refinement. The idea is to jump as quickly as possible.

# Help

Something not working? Got a question? Have an idea for an improvement? Feel free to [post an issue](https://github.com/phlippieb/jump-chrome-extension/issues) on this project! Just remember to search for existing issues that might already cover what you were going post first, please.

Also keep in mind that this is just a little pet project that I coded in a weekend, and that I maintain by myself. I make no commitments to support this project or its users.

# Developers

I created this project to fill a simple need for myself, and _for me_, that need is officially filled. However, this project is open source because there are probably always opportunities for improvements. If you'd like to contribute, feel free to [open a pull request](https://github.com/phlippieb/jump-chrome-extension/pulls)! If you'd like to contribute but you don't know what to do, you can always scan the [issues](https://github.com/phlippieb/jump-chrome-extension/issues) for inspiration.

Contributing ought to be really easy. I have close to zero experience with web development, and I was taken aback by how quickly I got this up and running. To contribute, you will need just
- Google Chrome
- Maybe JavaScript?

# Licence

The MIT License (MIT)

Copyright (C) 2020, Phlippie Bosman. https://github.com/phlippieb. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

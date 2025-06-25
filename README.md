![banner](/public/og.webp)

## Running on Localhost

- **Clone the repository**
  `git clone https://github.com/allthingslinux/iso.atl.dev.git`
  `cd next-gdrive-index`
- **Install required dependencies**
  `npm install`
  `yarn install`
- **Add environment file**
  - **Using Configuration**
    - Open [Deploy guide page](https://drive-demo.mbaharip.com/deploy#config)
    - Scroll to the bottom to see the configuration form
    - Fill out the form and download the file
    - Extract the `.env` file to the root folder
  - **Using example file**
    - `cp .env.example .env`
    - Fill out everything
- Run the app
  `npm run dev`
  `yarn dev`
- Check the app on `http://localhost:3000`

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

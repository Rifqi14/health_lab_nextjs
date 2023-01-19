<<<<<<< HEAD
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Rifqi14">
    <img src="./public/Images/bumame-logo-orange-hi-res%202.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Bumame Housecall</h1>

  <p align="center">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent egestas ex mi, eu egestas mauris efficitur a. Cras aliquam nibh nisl, vitae iaculis nibh dignissim at. Etiam convallis turpis orci, eget dapibus odio blandit a.
    <br />
    <a href="https://github.com/Rifqi14"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Rifqi14">View Demo</a>
    ·
    <a href="https://github.com/Rifqi14/issues">Report Bug</a>
    ·
    <a href="https://github.com/Rifqi14/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#change-environment-variable">Change Env</a></li>
    <li><a href="#deploy-on-docker-using-makefile">Deploying</a></li>
    <li><a href="#project-directory">Project Directory</a></li>
  </ol>
</details>

## Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- [![Next][next.js]][next-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- npm (mandatory)
- Docker (optional)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

This step by step if you want run this system on your local machine

1. Clone the repo
   ```sh
   git clone git@bitbucket.org:radyalabsdev/bumame.housecall.git
   ```
2. Install NPM packages
   ```
   npm install
   ```
3. Run development mode
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better or new at a team, please clone the repo and create a pull request.

1. Clone the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Change Environment Variable

For any change in environtment variable, or adding new variable. Make sure to update all `.env.*` file. Don't change filename of `.env` file.

## Deploy on Docker using Makefile

### Development environment - for doing testing

```
make build-development
make start-development
```

Open http://localhost:3001

### Staging environment - for doing UAT testing

```
make build-staging
make start-staging
```

Open http://localhost:3002

### Production environment - for users

```
make build-production
make start-production
```

Open http://localhost:3003

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Directory

This project already using atomic design in some of part. So make sure read this documentation to know about project directory detail.

```
.
├── components
│   ├── atoms
│   ├── constants
│   ├── molecules
│   ├── organisms
│   ├── templates
│   └── utils
├── docker
│   ├── development
│   ├── production
│   └── staging
├── pages
│   ├── api
│   ├── transaction-payment-code
│   ├── user-management
│   └── ...
├── public
│   ├── Icon
│   └── Images
└── styles
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

- components : Place all of your atomic design here.
  - atoms : Store all atomic component here.
  - constants : Store constant data here.
  - molecules : Store all molecules component here.
  - organisms : Store all organisms component here.
  - templates : Store all templates component here.
  - utils : Store all utility or helper here.
- docker : All docker file for every phase server are in here.
  - development : Dockerfile and compose for development server
  - staging : Dockerfile and compose for staging server
  - production : Dockerfile and compose for production server
- pages : Place all pages module in here.
- public : Place all file that can access public in here.
  - Icon : place any icon in here. Make sure save it in `*.svg` extension and `ic-` prefix for filename
  - Image : place any image in here. Make sure save it in `*.png|*.jpg|*.jpeg` extension and `img-` prefix for filename and make sure in high res.
- styles : Place all custom styles for system in here.
<p align="right">(<a href="#readme-top">back to top</a>)</p>
=======
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
>>>>>>> cf2c543623abdfb04966cde688e14d33f22e63d3

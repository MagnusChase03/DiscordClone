<a name="readme-top"></a>

![issues-shield]
![forks-shield]
![stars-shield]
![license-shield]

<h3 align="center">Discord Clone</h3>

  <p align="center">
    A little chat app inspired by discord
    <br />
    ·
    <a href="https://github.com/MagnusChase03/DiscordClone/issues">Report Bug</a>
    ·
    <a href="https://github.com/MagnusChase03/DiscordClone/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

My and a friend wanted to prep our javascript skills for an upcoming hackathon, so we decided to put our skills to the test making a discord clone. This app is designed to be a simple chat application where users can create chat servers and talk amongst themselves.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* ![react-shield]
* ![node-shield]
* ![docker-shield]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

To build this project yourself, you are going to need docker and yarn

1) Go to [docker](https://docs.docker.com/engine/install/) and install docker
2) Then go to [docker compose](https://docs.docker.com/compose/install/) and install docker compose
3) Install yarn by `npm install --global yarn`

### Installation

Build the docker images and install frontend dependecies

1) `docker-compose build`
2) `cd frontend && yarn`


## Usage

To run the backend database and API

```
docker-compose up
```

Then start the front end

```
yarn run dev
```

The app then should be running at `localhost:[PORT]`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the GPL License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[issues-shield]: https://img.shields.io/github/issues/MagnusChase03/DiscordClone?style=for-the-badge
[forks-shield]: https://img.shields.io/github/forks/MagnusChase03/DiscordClone?style=for-the-badge
[stars-shield]: https://img.shields.io/github/stars/MagnusChase03/DiscordClone?style=for-the-badge
[license-shield]: https://img.shields.io/github/license/magnuschase03/DiscordClone?style=for-the-badge
[node-shield]: https://img.shields.io/badge/NodeJS-20232A?style=for-the-badge&logo=node.js
[react-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react
[docker-shield]: https://img.shields.io/badge/Docker-20232A?style=for-the-badge&logo=docker

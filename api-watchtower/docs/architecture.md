# API Watchtower Architecture

## Overview

API Watchtower uses a simple local-first architecture.

```txt
Electron Desktop App
        |
        | loads
        v
Vite Frontend
        |
        | HTTP requests
        v
Local Express Server
        |
        | reads/writes
        v
Local JSON Storage
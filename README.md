# Fuel Rats

## Concept

All vehicles are spawned at the same time. A single `canister` and a `goal` are created during a round. During a round the `canister` must be taken to the `goal`. The `canister` can be stolen from the `canister` holder by bumping the front of your vehicle into the `canister holder`.

Upon bringing the `canister` to the goal a point is given to the player and a new round will begin.

## Scope

```
- Select Car Color, Neon, etc.
- 1 Car Type Randomly Per Matchup
- Include Boost + Jumping
- Discord Auth through Ares
- All cars have no max speed, except ball holder
- Ball holder is always at least 10 speed units slower if not more
- Ball holder gets slower over time
- Hidden power up that changes goal position once per round
- Maximum Players - 24~
```

## Folder Structure
```text
📂 src            # Where the code lives
├── 📂 client         # Client-side
├── 📂 configs        # Folders with 'resource.cfg'
├── 📂 core           # Shared code (event names, etc)
├── 📂 mods           # MLOs, Vehicles, etc.
├── 📂 server         # Server-side
├── 📂 webview        # UI / WebView
└── 📂 utility        # Scripts that assist with the build pipeline
```

_Do not put anything in the `resources` folder. It will be overwritten._

## Installation

```
npm install -g yarn
```

```
yarn install
```

```
yarn update
```

## Configurations

**First, never ever modidfy server.cfg. Changes will not be saved.**

All configurations are under the `config` folder.

Modify each environment configuration accordingly.

## Running

When running this repository it will automatically build on files based on repository.

_Develop alone with `yarn dev`. Test with friends with `yarn devtest`. Deploy with `yarn linux` or `yarn windows`_

| OS      | Description                  | Command        |
| ------- | ---------------------------- | -------------- |
| Linux   | WebView Build + Mods         | `yarn linux`   |
| Windows | WebView Build + Mods         | `yarn windows` |
| Windows | WebView Build + Mods + Debug | `yarn devtest` |
| Windows | Mods + Debug                 | `yarn dev`     |

## Todo List

### Spawn

- [x] Set Player into Vehicle
- [x] Disallow Player Leaving Vehicle
- [ ] Disable Controls to Leave Vehicle 

![](https://thumbs.gfycat.com/GrotesqueGrayGuineafowl-size_restricted.gif)

_Demonstrates Spawning_

### Collision

- [x] Collision Detection
- [ ] Zero Collision Near Round Spawn Point

![](https://thumbs.gfycat.com/HeavyIdealCrocodileskink-size_restricted.gif)

_Demonstrates Collision + Canister Behavior_

### Canister

- [x] Canister Create
- [x] Canister Pickup
- [x] Canister Drop
- [x] Canister Transfer
- [x] Canister Sync
- [x] Canister Blip Sync
- [x] Canister Object Sync
- [ ] Marker Shown to Distant Players

### Goals

- [ ] Goal Create
- [ ] Goal Blip Sync 
- [ ] Marker Shwon to Distant Players

### Rounds

- [ ] Start Round
  - [ ] Freeze Players Until Round Start
  - [ ] Release Controls After Starting Round
  - [ ] Create Countdown System for Starting Round
- [ ] End Round (arg should be player who scored)
  - [ ] Reset Canister (Determine New Canister Location)
  - [ ] Reset Vehicle (Stack Vehicles on Round Spawn)
  - [ ] Add Score
  - [ ] Disable Controls for Everyone
- [ ] Reset Scores (All Players)
- [ ] Set Round Vehicle Type Randomly
- [ ] Round Timer

### Gameplay Mechanics

- [ ] KeyBind Registration
- [ ] Jumping Vehicles
  - [ ] Add Cooldown for Jump @ 10s
  - [ ] Add Sound Alert for Off Cooldown
- [ ] Speed Boost Vehicles
  - [ ] Add Cooldown for Boost @ 15s
  - [ ] Add Sound Alert for Off Cooldown
- [ ] Lower Speed of Canister Holder Over Time

### WebView

- [ ] Add Page Indexing
- [ ] Add Page Swapping by Index

### Authentication (WebView)

Index: 0

- [ ] Ares Service for Authentication
- [ ] Get Discord Info from Ares
- [ ] Fix Debug / Info with Discord Info
- [ ] Add Simple File Based Bans (Console Command)
- [ ] Add Simple Admin System (Discord ID Based)
- [ ] Register in Page Indexing

### Customization (WebView)

Index: 1

- [ ] Vehicle Colour
- [ ] Vehicle Neon
- [ ] Vehicle Horn
- [ ] Register in Page Indexing

### Chat (WebView)

Index: 2

- [ ] Integrate Chat into WebView System
- [ ] Add Basic Chat System with Commands
- [ ] Add Admin System to Chat
- [ ] Register in Page Indexing
- [ ] Hide chat if score board key is pressed
- [ ] Display along-side HUD

### Score Board (WebView)

Index: 3

- [ ] Add HotKey to See Score Board (TAB)
- [ ] Only Register HotKey After Spawning
- [ ] Register in Page Indexing

### HUD (WebView)

Index: 4

- [ ] Hide HUD if score board key is pressed
- [ ] Register in Page Indexing
- [ ] Display along-side chat
- [ ] Speedometer
- [ ] Timer
- [ ] Power Ups
  - [ ] Jump
  - [ ] Boost
- [ ] Current Top 3-5 Players in Mini Score Board
- [ ] Show Current Score
- [ ] Show Player Count
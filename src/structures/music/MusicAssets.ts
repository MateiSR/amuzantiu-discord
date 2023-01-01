import { FilterOptions } from "shoukaku";

export const filters = new Map<string, FilterOptions>([
    ["nightcore", {
        timescale: {
            speed: 1.2999999523162842,
            pitch: 1.2999999523162842,
            rate: 1,
        }
    }],
    ["bassboost", {
        equalizer: [
            {band: 0, gain: 0.6},
            {band: 1, gain: 0.67},
            {band: 2, gain: 0.67},
            {band: 3, gain: 0},
            {band: 4, gain: -0.5},
            {band: 5, gain: 0.15},
            {band: 6, gain: -0.45},
            {band: 7, gain: 0.23},
            {band: 8, gain: 0.35},
            {band: 9, gain: 0.45},
            {band: 10, gain: 0.55},
            {band: 11, gain: 0.6},
            {band: 12, gain: 0.55},
            {band: 13, gain: 0}
        ]
    }],
    ["soft", {
        lowPass: {
            smoothing: 20.0
        }
    }],
    ["trebble", {
        equalizer: [
            {band: 0, gain: 0.6},
            {band: 1, gain: 0.67},
            {band: 2, gain: 0.67},
            {band: 3, gain: 0},
            {band: 4, gain: -0.5},
            {band: 5, gain: 0.15},
            {band: 6, gain: -0.45},
            {band: 7, gain: 0.23},
            {band: 8, gain: 0.35},
            {band: 9, gain: 0.45},
            {band: 10, gain: 0.55},
            {band: 11, gain: 0.6},
            {band: 12, gain: 0.55},
            {band: 13, gain: 0},
        ],
    }],
    ["vaporwave", {
        timescale: {
            speed: 0.8999999761581421,
            pitch: 0.8999999761581421,
            rate: 1,
        }
    }],
    ["8d", {
        rotation: {
            rotationHz: 0.2
        },
    }],
    ["tremolo", {
        tremolo: {
            depth: 0.5,
            frequency: 10
        },
    }]

]);
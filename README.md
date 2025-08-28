# EvoSim

### A simulation of natural selection

## Overview

EvoSim is a simulation designed to create the conditions for natural selection in simulated creatures. The creatures move around the screen semi-randomly, and as they do they slowly consume 'energy'.
If a creature's energy ever reaches zero, it dies. Creatures are able to gain more energy by eating the various plants that grow around the simulation, or by eating eachother. 
Each creature has three traits: speed, health, and ferocity. More points in speed makes the creatures faster, more points in ferocity makes the creatures do more damage to each other when attacking (making it easier to eat them), 
and health makes them more resistant to being attacked by other. Having more points into a trait makes the creature consume more energy per second, at a rate that is set by the user at the beginning of the simulation,
After a creature hits a certain threshold for energy, it will reproduce, creating a new creature with slight tweaks in trait distribution. These slight shifts in trait distribution allow the population
trends to shift over time

The core idea is that by adjusting how much energy is consumed by each trait, over time the creatures with cheaper/more desirable traits will become more prominent, mirroring the real life behavior of natural selection

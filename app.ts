import { Player } from "./player/player";
import { Fight } from './fight/fight';
import { writeFileSync } from 'fs';
import { Utils } from "./utils/utils";

Utils.LogStatus('.....Starting up the Wiener Fight!')

//reset the log
writeFileSync(Utils.log_folder+'log.txt','');


//generate new players
let Player1: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]} = new Player('Wiener Wurst');
let Player2: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]} = new Player('Wiener Schnitzel');

//start fight
const battle = new Fight(Player1, Player2);
battle.fight();



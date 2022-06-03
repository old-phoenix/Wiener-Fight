import { Player } from "./player/player";
import { Fight } from './fight/fight';
import { writeFileSync } from 'fs';
import { Utils } from "./utils/utils";

Utils.LogStatus('.....Starting up the Wiener Fight!')

//reset the log
writeFileSync(Utils.log_folder+'log.txt','');


//generate new players
let Player1 = new Player('Wiener Wurst');
let Player2 = new Player('Wiener Schnitzel');

//start fight
const battle = new Fight(Player1, Player2);
battle.fight();



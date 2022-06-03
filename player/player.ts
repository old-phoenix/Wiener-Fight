import { Utils } from "../utils/utils";
import { Skills } from './skills';

export class Player {
    name: string; //optional name

    //Player Stats
    strength: number;
    constitution: number;

    //Player Attributes
    damage: number;
    health: number;
    max_health:number;
    hit_chance: number = 100;
    crit_chance: number = 0;
    block_chance: number = 0;
    reflect_chance: number = 0;

    //Player Skills
    skills: { id: number, name: string, type: number }[] = [];

    constructor(name: string) {
      this.name = name;
      
      Utils.LogStatus('Initialising a new Player: ' + this.name);
    
      Utils.LogStatus('-- Generating Stats for Player: ' + this.name);

      //Setting Stats for the Player
      this.strength = Utils.getRandomInt(5, 10);
      this.constitution = Utils.getRandomInt(10, 20);

      Utils.LogStatus('---- STR: ' + this.strength + ' CON: '+this.constitution);
      Utils.LogStatus('------------------------------------');
      Utils.LogStatus('-- Generating Attributes for Player: ' + this.name);

      //Calculate Player-Attributes according to Player-Stats
      this.damage = this.strength * 1.3;
      this.health = this.constitution * 3;
      this.max_health = this.health;
      
      Utils.LogStatus('---- DMG: ' + this.damage + ' HEALTH: '+this.health);
      Utils.LogStatus('------------------------------------');
      Utils.LogStatus('-- Get Skills for Player: ' + this.name);

      //Generate a random skill set
      this.skills = new Skills().getRandomSkills();

    }

   
  }
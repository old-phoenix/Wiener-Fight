import { Utils } from '../utils/utils';
import { Player } from '../player/player';
import { Skills } from '../player/skills';

export class Fight {

    player_one: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]};
    player_two: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]};
    
    turn: number = 0;

    constructor(player_one: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}, 
                player_two: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}){
        
                    this.player_one = player_one;
                    this.player_two = player_two;
    }

    async doTurn(round:number){
        
        let fancy_round:string;

        switch (true) {
            case (round < 10):
                fancy_round = round + '    ';
                break;
            case (round < 100):
                fancy_round = round + '   ';
                break;
            case (round < 1000):
                fancy_round = round + '  ';
                break;
            case (round < 10000):
                fancy_round = round + ' ';
                break;
            default:
                fancy_round = round.toString();
                break;
        };

        Utils.LogStatus('\n\n');
        Utils.LogStatus('************************************');
        Utils.LogStatus('************ ROUND '+fancy_round+'************');
        Utils.LogStatus('************************************');


        //use skills
        let used_skills = Skills.useSkills(this.player_one, this.player_two);
        this.player_one = used_skills.player_one;
        this.player_two = used_skills.player_two;

        Utils.LogStatus('------------------------------------');

        //Update Skills for the Players
        this.player_one.skills = Skills.updateSkills(this.player_one.name,this.player_one.skills);
        
        Utils.LogStatus('------------------------------------');
        
        this.player_two.skills = Skills.updateSkills(this.player_two.name,this.player_two.skills);
        
        Utils.LogStatus('------------------------------------');

        return this;
    }

    async fight(){

        let round:number = 1;

        //aslong as one Player is alife
        while (this.player_one.health > 0 && this.player_two.health > 0) {
            //fight a round
            let turn:any = await this.doTurn(round);
            //update players
            this.player_one = turn.player_one;
            this.player_two = turn.player_two;
            Utils.LogStatus('---- '+this.player_one.name + ' Status:\n'+JSON.stringify(this.player_one));
            Utils.LogStatus('---- '+this.player_two.name + ' Status:\n'+JSON.stringify(this.player_two));
            round++; //increase round number
        }

        Utils.LogStatus('\n\n');
        Utils.LogStatus('************************************');
        Utils.LogStatus('************  RESULTS:  ************');
        Utils.LogStatus('************************************\n\n');

        
        if(this.player_one.health <= 0 && this.player_two.health > 0){
            //player 1 is dead and player 2 is alive
            
            Utils.LogStatus('************************************');
            Utils.LogStatus('************   WINNER   ************');
            Utils.LogStatus('************************************');
            Utils.LogStatus(this.player_two.name+'\n\n');
            Utils.LogStatus('************************************');
            Utils.LogStatus('************   LOOSER   ************');
            Utils.LogStatus('************************************');
            Utils.LogStatus(this.player_one.name+'\n\n');
            Utils.LogStatus('---- '+this.player_one.name + ' Status:\n'+JSON.stringify(this.player_one));
            Utils.LogStatus('---- '+this.player_two.name + ' Status:\n'+JSON.stringify(this.player_two));
        }else if(this.player_one.health > 0 && this.player_two.health <= 0){
            //player 1 is alive and player 2 is dead
            Utils.LogStatus('************************************');
            Utils.LogStatus('************   WINNER   ************');
            Utils.LogStatus('************************************');
            Utils.LogStatus(this.player_one.name+'\n\n');
            Utils.LogStatus('************************************');
            Utils.LogStatus('************   LOOSER   ************');
            Utils.LogStatus('************************************');
            Utils.LogStatus(this.player_two.name+'\n\n');
            Utils.LogStatus('---- '+this.player_one.name + ' Status:\n'+JSON.stringify(this.player_one));
            Utils.LogStatus('---- '+this.player_two.name + ' Status:\n'+JSON.stringify(this.player_two));
        }else{
            //both are dead
            //can be fixed by checking who died first
            Utils.LogStatus('************************************');
            Utils.LogStatus('************   DRAW   ************');
            Utils.LogStatus('************************************');
            Utils.LogStatus(this.player_one.name+'\n');
            Utils.LogStatus(this.player_two.name+'\n\n');


            Utils.LogStatus('---- '+this.player_one.name + ' Status:\n'+JSON.stringify(this.player_one));
            Utils.LogStatus('---- '+this.player_two.name + ' Status:\n'+JSON.stringify(this.player_two));
        }



        return this;
    }

    
} 
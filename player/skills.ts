import { Player } from './player';
import { Utils } from '../utils/utils';

export class Skills{
    
    
    //The actual skill pool to select the random skills
    //Type 0 = attacking, Type 1 = defending
    skill_pool: { id: number, name: string, type: number}[] = [
        { "id": 0, "name": "Simple Attack", "type": 0},
        { "id": 1, "name": "Weak Attack" , "type": 0},
        { "id": 2, "name": "Heavy Attack" , "type": 0},
        { "id": 3, "name": "Risky Attack", "type": 0},
        { "id": 4, "name": "Heal", "type": 1 },
        { "id": 5, "name": "Power Heal", "type": 1},
        { "id": 6, "name": "Shield", "type": 1 },
        { "id": 7, "name": "Counterattack", "type": 1},
        { "id": 8, "name": "Dodge", "type": 1}
    ];
    
    
    amount_atk: number = 2;
    amount_def: number = 2;
    skill_amount: number = this.amount_atk + this.amount_def;

    getRandomSkills(){

        //Just some logging here
        Utils.LogStatus('-- Selecting random Skills:');
        Utils.LogStatus('---- Amount of ATK-Skills: '+this.amount_atk);
        Utils.LogStatus('---- Amount of DEF-Skills: '+this.amount_def);
        Utils.LogStatus('---- Amount of Skills (TOTAL): ' + this.skill_amount);
        Utils.LogStatus('------------------------------------');


        let rnd_skills: { id: number, name: string, type:number }[] = [];
        
        for (let skill_slot = 0; skill_slot < this.skill_amount; skill_slot++) {

            Utils.LogStatus('---- Filling Skill-Slot: '+skill_slot);
            
            //We need to get a unique skill
            let is_unique: boolean = false;
            while(!is_unique){
                
                //Random number for skill
                let random_skill: number = Utils.getRandomInt(0, (this.skill_pool.length - 1));
                Utils.LogStatus('------ Skill selected: '+ JSON.stringify(this.skill_pool[random_skill]));

                //Do we have this skill already?
                if(rnd_skills.indexOf(this.skill_pool[random_skill]) > -1){
                    //Yes == Failed
                    Utils.LogStatus('------ Skill already selected in Slot: '+ rnd_skills.indexOf(this.skill_pool[random_skill]));
                }else{
                    
                    //Get the required amount for this type of skills
                    let amount_needed: number;
                    this.skill_pool[random_skill].type === 0? amount_needed = this.amount_atk : amount_needed = this.amount_def ;
                    Utils.LogStatus('------ Maximum Skills of type '+ this.skill_pool[random_skill].type + ': '+ amount_needed);

                    //How many did we generate of that type?
                    let amount_done: number = rnd_skills.filter(e => e.type === this.skill_pool[random_skill].type).length;
                    Utils.LogStatus('------ Ready Skills of type '+ this.skill_pool[random_skill].type + ': '+ amount_done);


                    //Do we have enough skills of that type?
                    if(amount_done == amount_needed){
                        //Yes == Failed
                        Utils.LogStatus('-------- Maximum Skills of type '+ this.skill_pool[random_skill].type + ' already set');
                    }else{
                        //No == Fill Slot
                        rnd_skills.push(this.skill_pool[random_skill]);
                        Utils.LogStatus('-------- Add Skill to Slot ('+skill_slot+'): '+JSON.stringify(this.skill_pool[random_skill]));
                        is_unique = true;
                    }
                }
            }

        }
        
        //return selected skills
        Utils.LogStatus('------------------------------------');
        Utils.LogStatus('-- Selected Skills: \n' + JSON.stringify(rnd_skills));
        Utils.LogStatus('------------------------------------');
        return rnd_skills;
    }
    
    static useSkills(player_one: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number,block_chance: number,reflect_chance: number,  skills: { id: number, name: string, type: number }[]},
                     player_two: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number,block_chance: number,reflect_chance: number,  skills: { id: number, name: string, type: number }[]}){

        //get first skill to use
        let first_skill_one: { id: number, name: string, type: number } = player_one.skills[0];
        let first_skill_two: { id: number, name: string, type: number } =  player_two.skills[0];
        
        //Check types of skills
        let is_def_one: boolean =  first_skill_one.type == 1? true: false;
        let is_def_two: boolean =  first_skill_two.type == 1? true: false;
        let is_atk_one: boolean =  first_skill_one.type == 0? true: false;
        let is_atk_two: boolean =  first_skill_two.type == 0? true: false;
        

        Utils.LogStatus('------------------------------------');
        Utils.LogStatus('-- Using Skills');
        
        //before we do any attacks, let us check if there are some defensive skills
        //we will always defend first, as these are buffs
        
        if(is_def_one){
            
            Utils.LogStatus('-- Defensive Skill for Player 1');
            
            //check the first skill and use it
            switch (first_skill_one.id) {
                case 4:
                    player_one.health = this.heal(player_one.name, player_one.health,player_one.max_health);
                    break;
                case 5:
                    player_one.health = this.powerHeal(player_one.name, player_one.health,player_one.max_health);
                    break;
                case 6:
                    player_one.block_chance = this.shield(player_one.name, player_one.block_chance);
                    break;
                case 7:
                    player_one.reflect_chance = this.counterAttack(player_one.name, player_one.reflect_chance)
                    break;
                case 8:
                    player_two.hit_chance = this.dodge(player_one.name, player_two.name,player_two.hit_chance);
                    break;
                default:
                    break;
            }
        }

        if(is_def_two){
            Utils.LogStatus('-- Defensive Skills for Player 2');

            //check the first skill and use it
            switch (first_skill_two.id) {
                case 4:
                    player_two.health = this.heal(player_two.name, player_two.health,player_two.max_health);
                    break;
                case 5:
                    player_two.health = this.powerHeal(player_two.name, player_two.health,player_two.max_health);
                    break;
                case 6:
                    player_two.block_chance = this.shield(player_two.name, player_two.block_chance);
                    break;
                case 7:
                    player_two.reflect_chance = this.counterAttack(player_two.name, player_two.reflect_chance)
                    break;
                case 8:
                    player_one.hit_chance = this.dodge(player_two.name, player_one.name,player_one.hit_chance);
                    break;
                default:
                    break;
            }
        }

        //now after we have all buffs and debuffs set, we can attack

        if(is_atk_one){
            
            Utils.LogStatus('-- Attacking Skill for Player 1');

            //check the first skill and use it
            switch (first_skill_one.id) {
                case 0:
                    let simple_return = this.simpleAttack(player_one, player_two);
                    player_one = simple_return.attacker;
                    player_two = simple_return.defender;
                    break;
                case 1:
                    let weak_return = this.weakAttack(player_one, player_two);
                    player_one = weak_return.attacker;
                    player_two = weak_return.defender;
                    break;
                case 2:
                    let heavy_return = this.heavyAttack(player_one, player_two);
                    player_one = heavy_return.attacker;
                    player_two = heavy_return.defender;
                    break;
                case 3:
                    let risky_return = this.riskyAttack(player_one, player_two);
                    player_one = risky_return.attacker;
                    player_two = risky_return.defender;                    
                    break;
                default:
                    break;
            }
        }

        if(is_atk_two){
            
            Utils.LogStatus('-- Attacking Skill for Player 2');

            //check the first skill and use it
            switch (first_skill_two.id) {
                case 0:
                    let simple_return = this.simpleAttack(player_two, player_one);
                    player_two = simple_return.attacker;
                    player_one = simple_return.defender;
                    break;
                case 1:
                    let weak_return = this.weakAttack(player_two, player_one);
                    player_two = weak_return.attacker;
                    player_one = weak_return.defender;
                    break;
                case 2:
                    let heavy_return = this.heavyAttack(player_two, player_one);
                    player_two = heavy_return.attacker;
                    player_one = heavy_return.defender;
                    break;
                case 3:
                    let risky_return = this.riskyAttack(player_two, player_one);
                    player_two = risky_return.attacker;
                    player_one = risky_return.defender;                    
                    break;
                default:
                    break;
            }
        }


        //reset stats for the players
        //this can be done in a different way
        //i could have kept it for next round and only reset after it was successfully used
        //but this can break the game, as it will have only misses and blocks

        Utils.LogStatus('------------------------------------');
        Utils.LogStatus('--  Reset Stats ');
        Utils.LogStatus('------------------------------------');
        Utils.LogStatus('-- Player '+player_one.name+':\n'+JSON.stringify(player_one));

        player_one.hit_chance = 100;
        player_one.reflect_chance = 0;
        player_one.crit_chance = 0;
        player_one.block_chance = 0;

        Utils.LogStatus('-- NEW Player '+player_one.name+':\n'+JSON.stringify(player_one));
        Utils.LogStatus('-- Player '+player_two.name+':\n'+JSON.stringify(player_two));

        player_two.hit_chance = 100;
        player_two.reflect_chance = 0;
        player_two.crit_chance = 0;
        player_two.block_chance = 0;

        Utils.LogStatus('-- NEW Player '+player_two.name+':\n'+JSON.stringify(player_two));
        

        return {player_one, player_two};
    }



    static updateSkills(name: string, skills : { id: number, name: string, type:number }[]){
        
        // we need to push first skill to last position

        Utils.LogStatus('Update Skills for Player: ' + name);
        Utils.LogStatus('-- Old Skills: \n' + JSON.stringify(skills));
        
        //what is the first skill?
        let first_skill: { id: number, name: string, type:number } = skills[0];
        Utils.LogStatus('-- First Skill: ' + JSON.stringify(skills[0]));

        //remove the first skill
        skills.splice(0, 1);
        Utils.LogStatus('-- Skills after splice: \n' + JSON.stringify(skills));

        //push to last position
        skills.push(first_skill);

        Utils.LogStatus('-- New Skills: \n' + JSON.stringify(skills));

        return skills;
    }

    //Followed by all the skill functions
    static simpleAttack(attacker: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]},
                        defender: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}){

        
        Utils.LogStatus('-- '+attacker.name+' does a simpleAttack!');
        
        //is it blocked? 
        if(this.isBlocked(defender.block_chance)){
            return {attacker, defender};
        }else if(this.isMissed(attacker.hit_chance)){
            return {attacker, defender};
        }else{
            Utils.LogStatus('---- '+attacker.name+' does '+attacker.damage+' Damage');
            Utils.LogStatus('---- Defender Health: '+defender.health);
            
            //reducing health
            defender.health -= attacker.damage;
            Utils.LogStatus('---- Defender New Health: '+defender.health);

            if(this.isReflected(defender.reflect_chance)){
                Utils.LogStatus('---- Attacker Health: '+attacker.health);
                //reducing health because it got reflected
                attacker.health -= attacker.damage;
                Utils.LogStatus('---- Attacker New Health: '+attacker.health);
            }
        }


        return {attacker, defender};

    }
    static weakAttack(attacker: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]},
                        defender: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}){

        
        Utils.LogStatus('-- '+attacker.name+' does a weakAttack!');
        
        //is it blocked? 
        if(this.isBlocked(defender.block_chance)){
            return {attacker, defender};
        }else if(this.isMissed(attacker.hit_chance)){
            return {attacker, defender};
        }else{
            Utils.LogStatus('---- '+attacker.name+' does '+(attacker.damage/2)+'  Damage');
            Utils.LogStatus('---- Defender Health: '+defender.health);
            
            //reducing health
            defender.health -= (attacker.damage/2);
            Utils.LogStatus('---- Defender New Health: '+defender.health);

            if(this.isReflected(defender.reflect_chance)){
                Utils.LogStatus('---- Attacker Health: '+attacker.health);
                //reducing health because it got reflected
                attacker.health -= (attacker.damage/2);
                Utils.LogStatus('---- Attacker New Health: '+attacker.health);
            }
        }

        return {attacker, defender};

    }
    static heavyAttack(attacker: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]},
                        defender: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}){

        
        Utils.LogStatus('-- '+attacker.name+' does a heavyAttack!');
        
        //is it blocked? 
        if(this.isBlocked(defender.block_chance)){
            return {attacker, defender};
        }else if(this.isMissed(attacker.hit_chance)){
            return {attacker, defender};
        }else{
            Utils.LogStatus('---- '+attacker.name+' does '+(attacker.damage*2)+'  Damage');
            Utils.LogStatus('---- Defender Health: '+defender.health);
            //reducing health
            defender.health -= (attacker.damage*2);
            Utils.LogStatus('---- Defender New Health: '+defender.health);

            if(this.isReflected(defender.reflect_chance)){
                Utils.LogStatus('---- Attacker Health: '+attacker.health);
                //reducing health because it got reflected
                attacker.health -= (attacker.damage*2);
                Utils.LogStatus('---- Attacker New Health: '+attacker.health);
            }
        }

        return {attacker, defender};

    }
    static riskyAttack(attacker: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]},
                        defender: {name: string, strength: number, constitution: number, damage: number, health: number, max_health:number, hit_chance: number, crit_chance:number, block_chance: number,reflect_chance: number, skills: { id: number, name: string, type: number }[]}){

        
        Utils.LogStatus('-- '+attacker.name+' does a riskyAttack!');
        
        //set the crit chance to 50% and generate random number
        attacker.crit_chance = 50;
        let triple_rnd:number = Math.random() * 100;
        let total_dmg:number;

        //random number is lower or same, player was lucky
        if(triple_rnd <= attacker.crit_chance){
            Utils.LogStatus('---- Critical Strike!');
            Utils.LogStatus('---- Attacker Crit-Chance: '+attacker.crit_chance+' Random Num: '+triple_rnd);
            total_dmg = attacker.damage * 3;
        }else{
            //unlucky, set missing chance
            attacker.hit_chance = 0;
            total_dmg = 0;
        }

        //is it blocked? 
        if(this.isBlocked(defender.block_chance)){
            return {attacker, defender};
        }else if(this.isMissed(attacker.hit_chance)){
            return {attacker, defender};
        }else{
            Utils.LogStatus('---- '+attacker.name+' does '+total_dmg+'  Damage');
            Utils.LogStatus('---- Defender Health: '+defender.health);
            //reducing health by total dmg
            defender.health -= total_dmg;
            Utils.LogStatus('---- Defender New Health: '+defender.health);

            if(this.isReflected(defender.reflect_chance)){
                Utils.LogStatus('---- Attacker Health: '+attacker.health);
                //reducing health because it got reflected
                attacker.health -= total_dmg;
                Utils.LogStatus('---- Attacker New Health: '+attacker.health);
            }
        }

        return {attacker, defender};

    }

    static heal(name: string, health: number,max_health:number){
        Utils.LogStatus('-- '+name+' uses Heal!');
        Utils.LogStatus('-- '+name+' Health: ' + health);
        Utils.LogStatus('-- '+name+' Max Health: ' + max_health);

        //heal by 10 points
        health += 10;

        Utils.LogStatus('-- '+name+' New Health: ' + health);
        if(health > max_health){ //is the player fully healed?
            health = max_health;  //reset health to max
            Utils.LogStatus('-- '+name+' has fully healed! - Max Health: ' + max_health +' Health: '+health);
        }
        return health;
    }
    static powerHeal(name: string, health: number, max_health:number){
        Utils.LogStatus('-- '+name+' uses PowerHeal!');
        Utils.LogStatus('-- '+name+' Health: ' + health);
        Utils.LogStatus('-- '+name+' Max Health: ' + max_health);

        //heal by 20 points
        health += 20;

        Utils.LogStatus('-- '+name+' New Health: ' + health);
        if(health > max_health){ //is the player fully healed?
            health = max_health;  //reset health to max
            Utils.LogStatus('-- '+name+' has fully healed! - Max Health: ' + max_health +' Health: '+health);
        }
        return health;
    }
    static shield(name: string, block_chance: number){
        Utils.LogStatus('-- '+name+' uses Shield!');
        //set block_chance to 100%
        block_chance = 100;
        Utils.LogStatus('-- '+name+' Block-Chance: ' + block_chance);
        return block_chance;
    }
    static counterAttack(name: string, reflect_chance: number){
        Utils.LogStatus('-- '+name+' uses counter_attack!');
        //set reflect_chance to 100%
        reflect_chance = 100;
        Utils.LogStatus('---- '+name+' Reflect-Chance: ' + reflect_chance);   
        return reflect_chance; 
    }
    static dodge(name: string, name_two:string, hit_chance:number){
        Utils.LogStatus('-- '+name+' uses dodge!');

        //set chance to dodge from 50-60%
        hit_chance = (100 - ((Math.random() * 10) + 50));
        Utils.LogStatus('-- --'+name_two+' Hit-Chance: '+hit_chance);
        return hit_chance;
    }

    static isBlocked(block_chance:number){
        
        //Chance to low
        if(block_chance == 0){ return false; }

        //generate random number
        let block_rnd:number = Math.random() * 100;

        //random number is lower or same -> lucky player
        if(block_rnd <= block_chance){
            Utils.LogStatus('---- But got blocked!');
            Utils.LogStatus('---- Defender Block-Chance: '+block_chance+' Random Num: '+block_rnd);
            return true;
        }
        return false;
    }

    static isMissed(hit_chance:number){
        
        //Chance to high
        if(hit_chance == 100){ return false; }
        
        //generate random number
        let hit_rnd:number = Math.random() * 100;
        
        //random number is lower or same -> lucky player
        if(hit_rnd > hit_chance){
            Utils.LogStatus('---- But missed!');
            Utils.LogStatus('---- Attacker Hit-Chance: '+hit_chance+' Random Num: '+hit_rnd);
            return true;
        }
        return false;
    }

    static isReflected(reflect_chance:number){
        
        //Chance to low
        if(reflect_chance == 0){ return false; }
        
        //generate random number
        let reflect_rnd:number = Math.random() * 100;
        
        //random number is lower or same -> lucky player
        if(reflect_rnd <= reflect_chance){
            Utils.LogStatus('---- Attack got reflected!');
            Utils.LogStatus('---- Attacker Reflect-Chance: '+reflect_chance+' Random Num: '+reflect_rnd);
            return true;
        }
        return false;
    }
}
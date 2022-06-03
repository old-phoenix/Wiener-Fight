import { appendFileSync } from 'fs';

export class Utils{

   //settings for the logs
   static debug_enabled:boolean = true;
   static write_file:boolean = true;
   static show_time:boolean = true;
   static log_folder:string = './logs/';

   
    static getRandomInt(min:number, max:number) : number{
        min = Math.ceil(min);
        max = Math.floor(max);
        return (Math.floor(Math.random() * (max - min + 1)) + min); 
    }

    static async LogStatus(status: any){
        
        //get time
        let my_date:Date = new Date();
        let my_time:string = my_date.getHours() + ':'+my_date.getMinutes()+':'+my_date.getSeconds()+':'+my_date.getMilliseconds();

        if(!this.debug_enabled){ // no debug
            return;
        }

        if(this.show_time){ //should we add the time?
            console.log(my_time+' '+status + "\n");
        }else{ 
            console.log(status + "\n"); 
        }

        if(this.write_file){ //append to log if enabled
            let path:string = this.log_folder + 'log.txt';
            appendFileSync(path, my_time+' '+status + "\n");
        }
        


    }

}
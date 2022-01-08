import {ColorResolvable} from 'discord.js'
// Color
interface roleInterface {
    ROLE_NAME: string;
    ROLE_COLOR:ColorResolvable
}

const ROLE :roleInterface ={
    ROLE_NAME:process.env.name||'project_alpha_MANAGER',
    ROLE_COLOR:'BLUE'
}

const PREFIX:String="^"
export {ROLE,PREFIX};
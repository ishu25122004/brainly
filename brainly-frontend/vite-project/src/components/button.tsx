import type {ReactElement} from "react";

interface ButtonProps {//here we deefine types of a comp
    //initial it has two variant like in ui "share brain" and "add content"
    variant : "primary" | "secondary" | "danger" | "ghost"
    //sm->small, md->medium, lg->large
    size : "sm" | "md" | "lg";
    //text inside the button
    text : string;
    //starticon is the icon in the start of button
    //here i use reacTelemnt b/c it has no fix type , we use icons here 
    startIcon? : ReactElement;
    endIcon? : ReactElement;
    onClick?: ()=> void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantStyles = {
    "primary": "bg-purple-600 text-white hover:bg-purple-700",
    "secondary": "bg-purple-200 text-purple-600 hover:bg-purple-300",
    "danger": "bg-red-200 text-red-600 hover:bg-red-300",
    "ghost": "bg-transparent text-gray-600 hover:bg-gray-100"
}

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"

const sizeStyles = {
    "sm": "py-1 px-2 text-xs",
    "md": "py-2 px-4 text-sm",
    "lg": "py-4 px-6 text-xl"
}

//concatination ->
//way 1=> "a" + "b"
//way 2=> ${a} ${b}
export const Button = (props:ButtonProps)=> {
    //if user choose primary variant than first string come
    //if user choose secondary variant than second string come
    //here props.some is work as if statement
    return <button type="button" onClick={props.onClick} disabled={props.loading} className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth ? "w-full" : ""}`}> 

    {/* loading spinner added */}
    {props.loading && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}

    {props.startIcon && !props.loading ? <div className="pr-1">{props.startIcon}</div> : null} 

    

    {props.text} {props.endIcon}</button>
}
//this are the inputs by user
{/* <Button variant="primary" size="md" onClick={()=>{}} text={"asd"} /> */}
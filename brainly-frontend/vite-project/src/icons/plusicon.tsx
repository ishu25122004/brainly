import {type IconProps , iconSizeVariants} from './index'

export const PlusIcon = (props: IconProps) => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconSizeVariants[props.size]}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

}
//here i write iconSizeVariants[props.size]
//in this i can also pass an argument in it that how much size i want for this icon
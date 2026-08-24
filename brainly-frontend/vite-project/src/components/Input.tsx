 export function Input({ placeholder,ref, type = "text", label}:{placeholder:string; ref:React.Ref<HTMLInputElement>; type?: string; label?: string }){
    return<div className="mb-3">
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 pl-1">{label}</label>}
        <input ref={ref} placeholder={placeholder} type={type} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"></input>
    </div>
}
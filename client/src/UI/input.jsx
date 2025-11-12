export default function Input({onChange,type,name,value,placeholder})
{
    return(
        <input type={type} 
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        name={name}
        className=' rounded-xl px-4 py-2  border
         focus:outline-none focus:ring-2 focus:ring-primary
         transition duration-300 w-full
         '/>
    )
}
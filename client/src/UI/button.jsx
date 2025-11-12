export default function Button({children,type='button',onClick,color1, disabled=false})
{
    const colors = {
    primary: 'bg-primary hover:bg-primary-dark',
    danger: 'bg-danger hover:bg-red-700',
    success: 'bg-success hover:bg-green-700',
    warning: 'bg-warning hover:bg-yellow-600 text-gray-900',
    info: 'bg-info hover:bg-cyan-700',
  };

  const colorClass=colors[color1]

    return(
        <button className={`px-4 py-2 max-h-12  border border-gray-300 rounded-md text-sm font-medium 
            text-white ${colorClass} flex items-center justify-center`}
         type={type}
        onClick={onClick} disabled={disabled}>
          {children}
        </button>
    )
}
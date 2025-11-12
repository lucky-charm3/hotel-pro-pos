import { FaTimes } from 'react-icons/fa';
import {useEffect,useRef} from 'react';

export default function Modal({ title, children, onClose, size = 'md' }) {
  const modalRef=useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

useEffect(()=>{
  const handleClickOutside=(e)=>{
    if(modalRef&&!modalRef.current.contains(e.target))
    {
      onClose()
    }
  }
  document.addEventListener('mousedown',handleClickOutside)
  return ()=>document.removeEventListener('mousedown',handleClickOutside);
},[])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className={`bg-white overflow-y-auto rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto`} ref={modalRef}>

        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
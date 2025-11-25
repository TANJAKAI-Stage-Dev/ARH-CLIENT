
export default function EmployeCard({ 
  avatar = "/images/user.png", 
  employeFunction = "Belle chanteuse", 
  name = "Dua Lipa", 
  email = "contact@gmail.com", 
  registrationNumber = "2578",
  onEdit = (id: string) => {},
  onDelete = (id: string) => {},
  onClick = (id: string) => {}
}) {
  
  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit(registrationNumber);
  };
  
  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(registrationNumber);
  };

  return (
    <div 
      className="relative flex items-center h-28 w-min-40 justify-between p-4 transition-all duration-200 bg-white border border-white rounded-lg shadow-sm cursor-pointer w-full hover:border-blue-500/100"
      style={{ borderWidth: "1px", borderStyle: "solid" }}
      onClick={() => onClick(registrationNumber)}
    >                       
      <div className="flex">
        {/* Avatar */}
        <div className="flex-shrink-0 mb-8 mr-4">
          <img 
            src={avatar}
            className="object-cover w-12 h-12 rounded-full"
          />
        </div>
        
        {/* Contact details */}
        <div className="flex flex-col flex-grow gap-2 mb-2">
          <div className="flex flex-col flex-grow">
            <div className="font-medium text-sm text-gray-700">{employeFunction}</div>
            <div className="font-bold text-sm text-gray-800">{name}</div>
          </div>
          <div className="text-sm text-gray-400">{email}</div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex flex-row gap-2 justify-end">
          <button 
            onClick={handleEdit}
            className="flex items-center justify-center w-6 h-6 text-white transition-transform duration-200 bg-blue-500 rounded-full cursor-pointer hover:scale-110"
            aria-label="Edit contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          
          <button 
            onClick={handleDelete}
            className="flex items-center justify-center w-6 h-6 text-white transition-transform duration-200 bg-red-500 rounded-full cursor-pointer hover:scale-110"
            aria-label="Delete contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      
        <div className="ml-2 text-sm text-gray-400 indent-5">
          {registrationNumber}
        </div>
      </div>
    </div>
  );
}
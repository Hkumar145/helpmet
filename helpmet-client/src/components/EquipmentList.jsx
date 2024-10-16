const EquipmentList = ({ equipments, onView, onUpdate, onDelete }) => {
    return (
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2">Equipment Name</th>
            <th className="py-2 px-4 border-b-2">Equipment ID</th>
            <th className="py-2 px-4 border-b-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((equipment) => (
            <tr key={equipment.equipmentID}>
              <td className="py-2 px-4 border-b">{equipment.equipmentName}</td>
              <td className="py-2 px-4 border-b">{equipment.equipmentID}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onView(equipment.equipmentID)}
                  className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => onUpdate(equipment)}
                  className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(equipment.equipmentID)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default EquipmentList;
  
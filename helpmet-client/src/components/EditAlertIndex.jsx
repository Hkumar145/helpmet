import {useParams} from "react-router-dom";
import EditEmployeeAlert from "@/components/EditEmployeeAlert.jsx";
import EditDepartmentAlert from "@/components/EditDepartmentAlert.jsx";


const EditAlertIndex = () => {

    const { type } = useParams();

    if (type === "employee") {
        return <EditEmployeeAlert />;
    }

    if (type === "department") {
        return <EditDepartmentAlert />;
    }

}
export default EditAlertIndex;
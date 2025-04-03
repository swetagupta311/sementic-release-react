import React, { useEffect, useState } from 'react';
import TableThree from '../../components/Tables/TableThree';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/apiService.js';

const ViewEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  useEffect(() => {
   
    getEmployee();
  }, []);

  const getEmployee = async () => {
    try {
      const response = await api.get('/getUsers');
      if (response.status === 200) {
        setEmployeeData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="View Employees" />
      <TableThree employeeData={employeeData} getEmployee={getEmployee} />
    </div>
  );
};

export default ViewEmployee;

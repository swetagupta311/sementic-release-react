import React,{useEffect,useState} from 'react';
import Brandtable from './Brandtable';
import api from '../../api/apiService.js';
const ViewBrand = () => {
   const [brandData, setBrandData] = useState([]);
   useEffect(() => {
     
      getBrands();
    }, []);
  
    const getBrands = async () => {
      try {
        const response = await api.get('/getbrands');
        if (response.status === 200) {
          setBrandData(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <div>
      <Brandtable brandData={brandData} getBrands={getBrands} />
    </div>
  );
};

export default ViewBrand;

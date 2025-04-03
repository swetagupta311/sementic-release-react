import React,{useState,useEffect} from 'react';
import Activitytable from './Activitytable';
import api from '../../api/apiService.js';
const ViewActivities = () => {
  const [activityData, setActivityData] = useState([]);
  useEffect(() => {
    getActivity();
  }, []);
  const getActivity = async () => {
    try {
      const response = await api.get('/getactivities');
      if (response.status === 200) {
        setActivityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
 
  return (
    <div>
      <Activitytable activityData={activityData} getActivity={getActivity} />
    </div>
  );
};

export default ViewActivities;

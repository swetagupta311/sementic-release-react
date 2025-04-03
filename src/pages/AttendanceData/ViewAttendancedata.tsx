import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import api from '../../api/apiService.js';
import { GrLinkNext } from 'react-icons/gr';
import { GrLinkPrevious } from 'react-icons/gr';
import Applyfilterpopup from './Applyfilterpopup.js';
import { FaDownload, FaFilter } from 'react-icons/fa';
const ViewAttendancedata = () => {
  const [viewStatus, setViewStatus] = useState(false);
  const [surveyId, setSurveyId] = useState();
  const [loading, setLoading] = useState(false);
  const [toaststatusActivity, setToastActivity] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadobjject, setDownloadObj] = useState({});
  const [cityData, setCityData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [openFilterPopup, setOpenFilterpopup] = useState(false);
  const [surveyFilterData, setSurveyFilterData] = useState([]);

  const [showFull1, setShowFull1] = useState(false);
  const [showFull2, setShowFull2] = useState(false);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    surveyFilterData?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((surveyFilterData?.length || 0) / itemsPerPage);
  //calling function to view outlet, city data
  useEffect(() => {
    console.log(downloadobjject);
    
    ViewOutlet();
    ViewCity();
  }, []);
  //get API for viewing outlet
  const ViewOutlet = async () => {
    try {
      const response = await api.get('/getoutlets');
      if (response.status === 200) {
        setOutletData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get API for listing city in dropdown
  const ViewCity = async () => {
    try {
      const response = await api.get('/getcities');
      if (response.status === 200) {
        setCityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //for toggling show more show less
  const toggleShow1 = () => setShowFull1(!showFull1);
  const toggleShow2 = () => setShowFull2(!showFull2);

  const downloadData = async () => {

    if (!downloadobjject) {
      alert('No data to download');
    }
    try {
      const queryString = `start_date=${downloadobjject.start_date}&end_date=${downloadobjject.end_date}&user_type=${downloadobjject.employee_type}&city_id=${downloadobjject.city_id}`;
      const response = await api.get(`/export-attendances?${queryString}`, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        if (response.data.length === 0) {
          alert('No data to download');
        } else {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'SurveyData.xlsx';
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Breadcrumb pageName="View Attendance Data" />
      <div className="max-w-full overflow-x-auto flex justify-between items-center mb-4">
        <button
          type="button"
          className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90 justify-center "
          onClick={() => setOpenFilterpopup(true)}
        >
          <FaFilter />
          Select Filter
        </button>
        {currentItems?.length > 0 && (
           <button
           className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90  justify-center "
           onClick={downloadData}
         >
           <FaDownload className="" /> Download Excel
         </button>
          )}
        
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {[
                'User Code',
                'User Name',
                'Attendence Date',
                'Check in Time',
                'Check out Time',
                'Check in address',
                'Check out address',
                'Activity Day',
                'Check In latitude',
                'Check In longitude',
                'Check Out latitude',
                'Check Out longitude',
                'Check In Selfie',
                'Check Out Selfie',
                'Check In Outlet Selfie',
                'Check Out Outlet Selfie',
              ].map((header, index) => (
                <th
                  key={index}
                  className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="16" className="text-center py-5">
                  No Data
                </td>
              </tr>
            ) : (
              currentItems.map((item, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.user?.user_code || 'Not Available'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.user?.firstname} {item.user?.lastname}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.attendence_date || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkin_time
                      ? new Date(item.checkin_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Not Available'}
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkout_time
                      ? new Date(item.checkout_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Not Available'}
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11 break-words whitespace-normal max-w-[200px]">
                    {item.checkin_address ? (
                      <>
                        {showFull1
                          ? item.checkin_address
                          : item.checkin_address.length > 30
                          ? item.checkin_address.substring(0, 30) + '...'
                          : item.checkin_address}
                        {item.checkin_address.length > 30 && (
                          <button
                            className="text-primary ml-1 underline"
                            onClick={toggleShow1}
                          >
                            {showFull1 ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11 break-words whitespace-normal max-w-[200px]">
                    {item.checkout_address ? (
                      <>
                        {showFull2
                          ? item.checkout_address
                          : item.checkout_address.length > 30
                          ? item.checkout_address.substring(0, 30) + '...'
                          : item.checkout_address}
                        {item.checkout_address.length > 30 && (
                          <button
                            className="text-primary ml-1 underline"
                            onClick={toggleShow2}
                          >
                            {showFull2 ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </td>
                
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.activity?.activity_day || 'Not Available'}
                  </td>
                
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkin_latitude || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkin_longitude || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkout_latitude || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.checkout_longitude || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <a
                      href={item.checkin_selfie}
                      target="_blank"
                      className={
                        item.checkin_selfie ? 'underline text-primary' : ''
                      }
                    >
                     {item.checkin_selfie?"View":"Not Availabale"}
                    </a>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <a
                      href={item.checkout_selfie}
                      target="_blank"
                      className={item.checkout_selfie?"underline text-primary":' '}
                    >
                      {' '}
                  {item.checkout_selfie?"View":"Not Availabale"}
                    </a>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <a
                      href={item.checkin_outlet_selfie}
                      target="_blank"
                      className={item.checkin_outlet_selfie?"underline text-primary":' '}
                    >
                      {' '}
                  {item.checkin_outlet_selfie?"View":"Not Availabale"}
                    </a>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <a
                      href={item.checkout_outlet_selfie}
                      target="_blank"
                      className={item.checkout_outlet_selfie?"underline text-primary":' '}
                    >
                      {' '}
                  {item.checkout_outlet_selfie?"View":"Not Availabale"}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {currentItems.length !== 0 ? (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <GrLinkPrevious /> Prev
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next <GrLinkNext />
            </button>
          </div>
        ) : null}
      </div>
      {/* Backdrop for loading  */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999">
          <img
            className="w-20 h-20 animate-spin"
            src="https://www.svgrepo.com/show/448500/loading.svg"
            alt="Loading icon"
          />
        </div>
      )}

      {openFilterPopup && (
        <Applyfilterpopup
          setLoading={setLoading}
          loading={loading}
          setSurveyFilterData={setSurveyFilterData}
          surveyFilterData={surveyFilterData}
          setOpenFilterpopup={setOpenFilterpopup}
          openFilterPopup={openFilterPopup}
          setDownloadObj={setDownloadObj}
          downloadobjject={downloadobjject}
        />
      )}
    </div>
  );
};

export default ViewAttendancedata;

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TiEdit } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/apiService.js';
import { IoIosStar } from 'react-icons/io';
import * as XLSX from 'xlsx';
import { GrLinkNext } from 'react-icons/gr';
import { GrLinkPrevious } from 'react-icons/gr';
import Applyfilterpopup from './Applyfilterpopup.js';
import { FaDownload, FaFilter } from 'react-icons/fa';
const SurveyData = () => {
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
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    surveyFilterData?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((surveyFilterData?.length || 0) / itemsPerPage);
  //calling function to view outlet, city data
  useEffect(() => {
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

  //API for deleting Survey data
  const deleteBrand = (id) => {
    Swal.fire({
      title: 'Do you want to delete this Survey',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
      icon: 'warning',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'swalconfirmButton',
        denyButton: 'swaldenyButton',
        cancelButton: 'custom-swal-cancel',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await api.delete(`/deletebrand/${id}`);
          if (response.status === 200) {
            setLoading(false);
            Swal.fire('Deleted!', '', 'success');
            props.getBrands();
            setTimeout(() => {
              Swal.close();
            }, 2000);
          }
        } catch (err) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      }
    });
  };
  const downloadData = async () => {
    setDownloadObj({});
    if (!downloadobjject) {
      alert('No data to download');
    }
    try {
      const queryString = `City_id=${
        downloadobjject.city_id
      }&outlet_id=[${downloadobjject.outlet_id.join(',')}]&start_date=${
        downloadobjject.start_date
      }&end_date=${downloadobjject.end_date}`;

      const response = await api.get(`/exportsurveys?${queryString}`, {
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
  const MipdownloadData = async () => {
    setDownloadObj({});
    if (!downloadobjject) {
      alert('No data to download');
    }
    try {
      const queryString = `City_id=${
        downloadobjject.city_id
      }&outlet_id=[${downloadobjject.outlet_id.join(',')}]&start_date=${
        downloadobjject.start_date
      }&end_date=${downloadobjject.end_date}`;

      const response = await api.get(
        `/export-static-mis-surveys?${queryString}`,
        {
          responseType: 'blob',
        },
      );

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
      <Breadcrumb pageName="View Survey Data" />
      <div className="max-w-full overflow-x-auto flex justify-between items-center mb-4">
        <button
          type="button"
          className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90 justify-center "
          onClick={() => setOpenFilterpopup(true)}
        >
          <FaFilter />
          Select Filter
        </button>
        <div className="flex gap-6">
          {currentItems?.length > 0 && (
            <>
              <button
                className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90  justify-center "
                onClick={MipdownloadData}
              >
                <FaDownload className="" /> MIP Report
              </button>
              <button
                className="px-4 py-2 flex items-center gap-2 rounded bg-primary text-gray hover:bg-opacity-90  justify-center hidden"
                onClick={downloadData}
              >
                <FaDownload className="" /> Download Excel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {[
                'FWP Code',
                'FWP Name',
                'Activity Name',
                'Age(Q1 a)',
                'Smokes(Q1 b)',
                'Participated(Q2)',
                'Name(Q3 a)',
                'Gender(Q3 b)',
                'Brand Name (Q4 a)',
                'Variant Name (Q4 b)',
                'Competition Brand (Q5 a)',
                'Competition Variant (Q5 b)',
                'Product Rating (Q6 a)',
                'Pack Rating (Q6 b)',
                'Stick Rating (Q6 c)',
                'Feedback',
                'Action',
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
                <td colSpan="14" className="text-center py-5">
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
                    {`${item.user?.firstname} ${item.user?.lastname}` ||
                      'Not Available'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.activity?.activity_type || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.age || 'Not Available'}
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.do_you_smoke ? 'Yes' : 'No'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.participate_survey ? 'True' : 'False'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.name || 'Not Available'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 xl:pl-11">
                    {item.gender || 'Not Available'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.brand?.brand_name || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.variant?.variant_name || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.competitonBrand?.brand_name || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.comptitonVariant?.variant_name || 'Not given'}
                  </td>
                  {[
                    item.product_rating,
                    item.pack_rating,
                    item.stick_rating,
                  ].map((rating, index) => (
                    <td
                      key={index}
                      className="border-b border-[#eee] py-5 px-4"
                    >
                      <div className="flex items-center">
                        {rating ? (
                          <>
                            {rating}
                            <IoIosStar className="text-[#FFD700] h-[22px] w-[25px]" />
                          </>
                        ) : (
                          'Not Given'
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="border-b border-[#eee] py-5 px-4">
                    {item.feedback || 'Not given'}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 text-center">
                    {' '}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        deleteBrand(item.id);
                      }}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
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

export default SurveyData;

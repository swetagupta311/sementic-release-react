import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TiEdit } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import { validationSchemaSurvey } from './validationSchemaSurvey';
import api from '../../api/apiService.js';
import { ImCancelCircle } from 'react-icons/im';
import { useFormik } from 'formik';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Select from 'react-select';
import qs from "qs"; 
const Applyfilterpopup = (props) => {
  const [toaststatusActivity, setToastActivity] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityData, setCityData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const itemsPerPage = 12;
  const initialValues = {
    city_id: '',
    outlet_id: [],
    start_date: '',
    end_date: '',
  };
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: validationSchemaSurvey,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
        props.setDownloadObj(values)
      getSurveys(values);
    },
  });
  const getSurveys = async (values) => {
    props.setLoading(true);

    try {
      const queryString = `City_id=${values.city_id}&outlet_id=[${values.outlet_id.join(",")}]&start_date=${values.start_date}&end_date=${values.end_date}`;
      const response = await api.get(`/getsurveys?${queryString}`);
      if (response.status === 200) {
        props.setOpenFilterpopup(false);
        props.setSurveyFilterData(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      props.setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = surveyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(surveyData.length / itemsPerPage);
  //calling function to view outlet, city data
  useEffect(() => {
    // ViewOutlet();
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

  const OutletByCity = async (e) => {
    try {
      const response = await api.get('/getoutlets', {
        params: {
          city_id: e,
        },
      });
      if (response.status === 200) {
        setOutletData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCityChange = (e) => {
    setFieldValue('city_id', e.target.value);
    OutletByCity(e.target.value);
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleChange1 = (selected) => {
    const newSelectedOptions = selected ? selected.map((option) => option.value) : [];
    setSelectedOptions(newSelectedOptions); // Update selected options state
  };
  useEffect(() => {
    if (selectedOptions.length > 0) {
      setFieldValue('outlet_id', selectedOptions);
    }
  }, [selectedOptions]); 
  
  
  return (
    <div
      className="relative z-999"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity "
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 rounded-lg">
          <div className="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[47rem]">
            <button
              className="float-right mr-4"
              onClick={() => props.setOpenFilterpopup(!props.openFilterPopup)}
            >
              <ImCancelCircle className="h-12 w-[23px]" />
            </button>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h3
                className="font-semibold text-gray-900 text-2xl mt-2 mb-4"
                id="modal-title"
              >
                Filter
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="max-w-full overflow-x-auto">
                  <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                    <div className="w-full lg:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        City <span className="text-meta-1">*</span>
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          name="city_id"
                          value={values.city_id}
                          onChange={handleCityChange}
                          onBlur={handleBlur}
                          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                            isOptionSelected ? 'text-black dark:text-white' : ''
                          }`}
                        >
                          <option
                            value=""
                            disabled
                            className="text-body dark:text-bodydark"
                          >
                            {' '}
                            Select your city
                          </option>

                          {cityData ? (
                            cityData.map((item, index) => (
                              <option
                                key={index}
                                value={item.id}
                                className="text-body dark:text-bodydark"
                              >
                                {item.city_name}
                              </option>
                            ))
                          ) : (
                            <option
                              value=""
                              disabled
                              className="text-body dark:text-bodydark"
                            >
                              {' '}
                              No City{' '}
                            </option>
                          )}
                        </select>

                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                        {touched.city_id && errors.city_id ? (
                          <p className="errormsg">{errors.city_id}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Outlet 
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <div>
                      <Select
                        options={
                          outletData
                            ? outletData.map((item) => ({
                                label: item.outlet_name,
                                value: item.id,
                              }))
                            : []
                        }
                        isMulti
                        onChange={handleChange1}
                      />
                    </div>
                    {touched.outlet_id && errors.outlet_id ? (
                      <p className="errormsg p-6">{errors.outlet_id}</p>
                    ) : null}
                  </div>
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                    {/* Start Date */}
                    <div className="relative w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Start Date <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={values.start_date || ''}
                        onChange={(e) =>
                          setFieldValue('start_date', e.target.value)
                        }
                      />
                      {touched.start_date && errors.start_date && (
                        <p className="errormsg">{errors.start_date}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="relative w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        End Date <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={values.end_date || ''}
                        onChange={(e) =>
                          setFieldValue('end_date', e.target.value)
                        }
                      />
                      {touched.end_date && errors.end_date && (
                        <p className="errormsg">{errors.end_date}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applyfilterpopup;

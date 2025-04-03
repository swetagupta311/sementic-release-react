import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from 'formik';
import { validationSchema } from './validationSchema';
import api from '../../api/apiService.js';
const AddBrands = () => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    brandname: '',
    variation: [],
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
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
    
      AddBrand(values);
    },
  });

  const [variations, setVariations] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      setVariations([...variations, inputValue]);
      setFieldValue('variation', [...values.variation, inputValue]);
      setInputValue(''); 
    }
  };

  const handleRemove = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const AddBrand = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding Brand...', {
      theme: 'colored',
      closeOnClick: true,
    });
    const lowercaseCity = values.brandname.toLowerCase();
    const capitalizedCity = lowercaseCity.charAt(0).toUpperCase() + lowercaseCity.slice(1);
    try {
      const response = await api.post('/addbrand', {
        brand_name: capitalizedCity,
        variants: values.variation,
      });
  
      if (response.status === 201) {
        setLoading(false);
        toast.update(loadingToast, {
          render: 'Brand added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
  
        // Reset form and loading state AFTER toast update
        resetForm();
      }
    } catch (err) {
      console.error(err);
  
      toast.update(loadingToast, {
        render:
          err.response?.data?.error ||
          (Array.isArray(err.response?.data?.errors)
            ? err.response.data.errors[0]?.msg
            : 'Something went wrong'),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        theme: 'colored',
        closeOnClick: true,
      });
  
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Breadcrumb pageName="Add Brands/variation" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Brands/Variations
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Brand Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[0-9]/g, ''))
                    }
                    name="brandname"
                    value={values.brandname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter your outlet brandname"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.brandname && errors.brandname ? (
                    <p className="errormsg">{errors.brandname}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Variation Name <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input flex flex-wrap gap-2 p-2 border border-stroke rounded">
                    {variations.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md"
                      >
                        <span className="text-black dark:text-white">
                          {name}
                        </span>
                        <button
                          onClick={() => handleRemove(index)}
                          className="ml-2 text-red-500"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      name="variation"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter variation name"
                      className="flex-1 border-none outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="ml-2 bg-primary text-white px-3 py-1 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  {touched.variation && errors.variation ? (
                    <p className="errormsg">{errors.variation}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Brands
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
         {/* Backdrop for loading */}
         {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999">
           <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/448500/loading.svg" alt="Loading icon" />
        </div>
      )} */}


    </div>
  );
};

export default AddBrands;

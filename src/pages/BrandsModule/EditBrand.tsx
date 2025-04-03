import React, { useEffect, useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { MdEditSquare } from 'react-icons/md';
import { useFormik } from 'formik';
import api from '../../api/apiService.js';
import { validationSchemaedit } from './validationSchemaedit';
import { ToastContainer, toast } from 'react-toastify';
const EditBrand = (props) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [loaderforfetching, setLoaderforfetching] = useState(false);
   const [loaderforupdating, setLoaderforupdating] = useState(false);
  const [brandId, setBrandId] = useState();
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
    resetForm
  } = useFormik({
    initialValues,
    validationSchema: validationSchemaedit,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      editBrand(values)
    },
  });
  const [variations, setVariations] = useState([]);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    getBrandsById();
  }, []);

const handleAdd = () => {
  if (inputValue.trim() !== '') {
    const newVariant = { variant_name: inputValue }; 
    setVariations([...variations, newVariant]);

    // Update Formik field with just variant names
    setFieldValue('variation', [...values.variation, inputValue]); 

    setInputValue(''); // Clear input
  }
};

const handleRemove = (index) => {
  const updatedVariations = variations.filter((_, i) => i !== index);
  setVariations(updatedVariations);

  // Update Formik field with just variant names
  setFieldValue(
    'variation',
    updatedVariations.map((v) => v.variant_name),
  );
};


  const getBrandsById = async () => {
    setLoaderforfetching(true);
    try {
      const response = await api.get('/getbrands');
  
      if (response.status === 200) {

  
        const filteredData = response.data.filter(
          (item) => item.id == props.brandsId
        );
     
  
        if (filteredData.length > 0) {
          const brand = filteredData[0];
          setBrandId(brand.id);
          setFieldValue('brandname', brand.brand_name);
  
          // Extract variation IDs and set them in the form
          const variationIds = brand.variants.map((variant) => variant.variant_name);
          setFieldValue('variation', variationIds);
  
          // Store variations to display names in UI
          setVariations(brand.variants);
        }
      }
    } catch (err) {
      console.error('Error fetching brand data:', err);
    } finally {
      setLoaderforfetching(false);
    }
  };
  
    //put api to edit state
    const editBrand = async (values) => {
      setLoaderforupdating(true);
      const loadingToast = toast.loading('Updating Brands...', {
        theme: 'colored',
        closeOnClick: true,
      });
  
      try {
        const response = await api.put(`/editbrand/${props.brandsId}`, {
          variants:values.variation,
          brand_name:values.brandname
        });
  
        if (response.status === 200) {
          props.setEditpopup(false)
          props.setToast(!props.toaststatus)
          resetForm();
          toast.update(loadingToast, {
            render: 'Brand module updated successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
            theme: 'colored',
            closeOnClick: true,
          });
          props.getBrands();
        }
      } catch (err) {
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
      } finally {
        setLoaderforupdating(false);
      }
    };
  
  return (
    <div
      className="relative z-999"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[47rem]">
            <button
              className="float-right mr-4"
              onClick={() => props.setEditpopup(!props.editPopup)}
            >
              <ImCancelCircle className="h-12 w-[23px]" />
            </button>
            <div className="bg-white px-2 pt-3 pb-2 sm:p-4 sm:pb-2">
              <div className="sm:items-start">
                {loaderforfetching ? (
                  <div className="flex flex-col justify-center items-center h-full">
                    {' '}
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-14 h-12 text-[#3c50e0] animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <p className="mt-4">Loading....</p>{' '}
                  </div>
                ) : (
                  <>
                    {' '}
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                      <MdEditSquare className="h-12 w-[23px]" />
                    </div>
                    <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="font-semibold text-gray-900 text-2xl mt-4"
                        id="modal-title"
                      >
                        Edit Brand
                      </h3>
                      <div className="mt-2">
                        {' '}
                        <form onSubmit={handleSubmit}>
                          <div className="">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
                              <div className="w-full xl:w-full">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Brand Name{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.replace(
                                      /[0-9]/g,
                                      '',
                                    ))
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
                              <div className="w-full xl:w-full">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Variation Name{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input flex flex-wrap gap-2 p-2 border border-stroke rounded">
                                  {variations.map((variant, index) => (
                                    <div
                                      key={variant.id}
                                      className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md"
                                    >
                                      <span className="text-black dark:text-white">
                                        {variant.variant_name}
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
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                    placeholder="Enter variation name"
                                    className="flex-1 border-none outline-none bg-transparent"
                                  />
                                  <button
                                   type='button'
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

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-300 sm:ml-3 sm:w-auto"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                  props.setEditpopup(!props.editPopup)
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
         <ToastContainer />

      </div>
    </div>
  );
};

export default EditBrand;

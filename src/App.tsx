import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AddEmployee from './pages/Employee/AddEmployee';
import ViewEmployee from './pages/Employee/ViewEmployee';
import AddState from './pages/StateModule/AddState';
import AddOutlet from './pages/StateModule/AddOutlet';
import AddActivity from './pages/ActivityModule/AddActivity';
import ViewActivities from './pages/ActivityModule/ViewActivities';
import AddBrands from './pages/BrandsModule/AddBrands';
import ViewBrand from './pages/BrandsModule/ViewBrand';
import PrivateRoutes from './utils/PrivateRoutes';
import Logout from './pages/Authentication/Logout';
import NotFound from './utils/Notfound';
import SurveyData from './pages/ActivityModule/SurveyData';
import AddSurveyData from './pages/AddSurveyModule/AddSurveyData';
import { Helmet } from 'react-helmet-async';
import ViewAttendancedata from './pages/AttendanceData/ViewAttendancedata';
import { v4 as uuidv4 } from "uuid";
import Maintenance from './utils/Maintenance';
function App() {
  const nonce = uuidv4();
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
 
      <Routes>
        {/* <Route
        path="/dashboard"
        index
        element={
          <PrivateRoutes>
            <DefaultLayout>
              <PageTitle title="VMS Techs| Dashboard" />
              <ECommerce />
            </DefaultLayout>
          </PrivateRoutes>
        }
      /> */}
        {/* <Route
          path="/calendar"
          element={
            <DefaultLayout>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </DefaultLayout>
          }
        /> */}
        {/* <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        /> */}
        {/* <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        /> */}
        {/* <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        /> */}
        <Route path="/" element={<Navigate to="/Employee/add-employee" />} />
        <Route
          path="/Employee/add-employee"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="VMS Techs | Add Employee" />
                <AddEmployee />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/employee/view-employees"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="View Employee" />
                <ViewEmployee />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />

        <Route
          path="/states/add-states"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="VMS Techs | Add States" />
                <AddState />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/states/add-outlet"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="Add Outlet" />
                <AddOutlet />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/activity/add-activity"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="Add Activity" />
                <AddActivity />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/activity/view-activity"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="View Activity" />
                <ViewActivities />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/survey-data"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="View Survey Data" />
                <SurveyData />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/add-survey-data"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="Add Survey Data" />
                <AddSurveyData />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/brands/add-brands"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="VMS Techs | Add Brands" />
                <AddBrands />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />

        <Route
          path="/brands/view-brands"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="VMS Techs | View Brands" />
                <ViewBrand />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />
            <Route
          path="/attendance-data"
          element={
            <PrivateRoutes>
              <DefaultLayout>
                <PageTitle title="VMS Techs | View Brands" />
                <ViewAttendancedata />
              </DefaultLayout>
            </PrivateRoutes>
          }
        />


        <Route
          path="/tables"
          element={
            <DefaultLayout>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </DefaultLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DefaultLayout>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </DefaultLayout>
          }
        />
        <Route
          path="/chart"
          element={
            <DefaultLayout>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </DefaultLayout>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <DefaultLayout>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </DefaultLayout>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <DefaultLayout>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </DefaultLayout>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="VMS Techs | Signin" />
              <SignIn />
{/*               <Maintenance/> */}
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  
  );
}

export default App;

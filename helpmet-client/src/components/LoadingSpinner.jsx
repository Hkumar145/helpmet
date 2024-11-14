import { Audio } from 'react-loader-spinner'

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-6">
      <Audio
        height="80"
        width="80"
        radius="9"
        color="#6938EF"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </div>
  );
};

export default LoadingSpinner;
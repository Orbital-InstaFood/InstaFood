function displayImage(image) {
  return (
    <div>
      <img src={image} alt="post" style={{ width: '300px', height: '200px' }} />
    </div>
  );
}

export default displayImage;

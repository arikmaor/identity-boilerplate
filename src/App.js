import '@reshuffle/code-transform/macro';
import React, { useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone'

import { useAuth } from '@reshuffle/react-auth';

const centerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const wrapperStyle = {
  ...centerStyle,
  width: '100%',
  height: '100%',
};

const contentStyle = {
  ...centerStyle,
  width: '40%',
  height: '20%',
};

const profileStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const linkStyle = {
  fontSize: '30px',
};

function ContentWrapper(props) {
  return (
    <div style={wrapperStyle}>
      <div style={contentStyle}>
        {props.children}
      </div>
    </div>
  );
}

function useFileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onChangeHandler = useCallback(async (e) => {
    window.xfiles = e.target.files;
    const filesArr = Array.from(e.target.files)
    setFiles(filesArr);

    setUploading(true);

    const formData = new FormData()

    filesArr.forEach((file, i) => {
      formData.append(i, file)
    });

    const res = await fetch(`/image-upload`, {
      method: 'POST',
      body: formData
    });
    const filesWithTokens = await res.json();
    console.log(filesWithTokens)
    setUploading(false);
  }, []);

  return {
    files,
    uploading,
    inputProps: {
      type: 'file',
      onChange: onChangeHandler
    }
  }
}

function App() {
  const {
    loading,
    error,
    authenticated,
    profile,
    getLoginURL,
    getLogoutURL,
  } = useAuth();

  const { inputProps, uploading, files } = useFileUpload();

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: files => inputProps.onChange({target: {files}})});

  const onClickHandler = useCallback((e) => {
    console.log('upload')
  }, []);

  if (loading) {
    return <ContentWrapper><h2>Loading...</h2></ContentWrapper>;
  }
  if (error) {
    return <ContentWrapper><h1>{error.toString()}</h1></ContentWrapper>;
  }

  return (
    <ContentWrapper>
      {
        authenticated ? (
          <div style={profileStyle} {...getRootProps()}>
            <img src={profile.picture}
                 alt='user profile'
            />
            <span>{profile.displayName}</span>
            <a style={linkStyle} href={getLogoutURL()}>Logout</a>
            <div>
              <div>
                <div>isDragActive: {isDragActive.toString()}</div>
                <input multiple {...getInputProps({onChange: () => {console.log('onchange')}})}/>
                <button onClick={onClickHandler}>Upload!</button>
              </div>
              {files.map(({name}) => (
                <div>{name}</div>
              ))}
              <div>Uploading: {uploading.toString()}</div>
            </div>
          </div>
        ) : (
          <a style={linkStyle} href={getLoginURL()}>Login</a>
        )
      }
    </ContentWrapper>
  );
}

export default App;

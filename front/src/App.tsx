import { useState } from "react";

function App() {
  const [files, setFiles] = useState<{ fileName: string; downloadUrl: string }[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const listFiles = async (userId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/listFiles`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    const { files } = await response.json() as { files: { fileName: string; downloadUrl: string }[]};
    setFiles(files);
  };

  return (
    <div>
      <div>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={() => listFiles(userId)} disabled={userId === ''}>List files</button>
      </div>
      {userId !== '' && (
        <div>
          <p>Upload File</p>
          <input type="file" onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          max={1}
          accept="image/png, image/jpeg"
          />
          <button onClick={async () => {
            if (file === null) {
              throw new Error('File is null');
            }

            const fileName = file.name;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/uploadFile`, {
              method: 'POST',
              body: JSON.stringify({ userId, fileName }),
            });
            const { uploadUrl } = await response.json() as { uploadUrl: string };

            await fetch(uploadUrl, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': file.type,
              },
            });

            await listFiles(userId);
          }} disabled={file === null}>Upload</button>
        </div>
      )}
      <div>
        {files.map(({ downloadUrl, fileName }) => <img src={downloadUrl} key={fileName} height={300}/>)}
      </div>
    </div>
  )
}

export default App
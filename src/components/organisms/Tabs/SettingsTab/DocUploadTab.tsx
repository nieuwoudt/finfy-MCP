import { DropzoneComponent } from "@/components/molecules";

const DocUploadTab = () => {
  return (
    <div className="my-9">
      <div className="p-3 border rounded-md bg-navy-15 border-navy-5">
        <DropzoneComponent
          name={""}
          onSubmit={function (files: {
            [key: string]: (Blob | MediaSource)[];
          }): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};
export { DocUploadTab };

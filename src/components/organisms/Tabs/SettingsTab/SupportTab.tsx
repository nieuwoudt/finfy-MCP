import { Icon, Label, Textarea } from "@/components/atoms";
import { DropzoneComponent, FieldForm } from "@/components/molecules";

const SupportTab = () => {
  return (
    <div className="my-9">
      <div className="p-4 border rounded-md bg-navy-15 border-navy-5">
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="flex gap-2 text-2xl font-semibold text-white items-center">
            <Icon
              type="SupportIcon"
              className="w-6 h-6 stroke-transparent fill-white"
            />
            Contact us
          </h3>
          <p className="text-white font-semibold text-sm">
            Our friendly support team is here to help you.
          </p>
        </div>
        <form className="grid grid-cols-2 gap-x-3 gap-y-8">
          <FieldForm
            name="firstName"
            label={"First name"}
            full
            type="text"
            isRequired
            placeholder="Niewoudt"
          />
          <FieldForm
            name="lastName"
            label={"Last name"}
            full
            type="text"
            isRequired
            placeholder="Gresse"
          />
          <FieldForm
            classes={{
              wrapper: "col-span-2",
            }}
            name="email"
            label={"Email"}
            full
            type="email"
            isRequired
            placeholder="Jane Doe"
          />
          <FieldForm
            classes={{
              wrapper: "col-span-2",
            }}
            name="phone"
            label={"Phone number"}
            full
            type="number"
            placeholder="+14378370406"
          />
          <div className="col-span-2 flex flex-col gap-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Hello Finfy team"
              className="border-purple-15 min-h-[111px] bg-navy-25"
            />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <Label>Attach file</Label>
            <DropzoneComponent
              name={""}
              onSubmit={function (files: {
                [key: string]: (Blob | MediaSource)[];
              }): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export { SupportTab };

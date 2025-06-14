
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdvancedOptions = {
  analytics: boolean;
  tracking: boolean;
  thirdParty: boolean;
  retention: boolean;
  cookies: boolean;
  userRights: boolean;
  dataTypes: {
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    payment: boolean;
  };
  customSection: string;
};

type Props = {
  options: AdvancedOptions;
  onChange: (options: AdvancedOptions) => void;
};

export default function AdvancedPolicyOptions({ options, onChange }: Props) {
  function set<K extends keyof AdvancedOptions>(k: K, v: AdvancedOptions[K]) {
    onChange({ ...options, [k]: v });
  }
  function setDataType(type: keyof AdvancedOptions["dataTypes"], value: boolean) {
    onChange({ ...options, dataTypes: { ...options.dataTypes, [type]: value } });
  }
  return (
    <div className="grid gap-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Collected Data Types</p>
        <div className="flex flex-wrap gap-2">
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataTypes.name} onCheckedChange={val => setDataType("name", val)} /> Name
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataTypes.email} onCheckedChange={val => setDataType("email", val)} /> Email
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataTypes.phone} onCheckedChange={val => setDataType("phone", val)} /> Phone
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataTypes.address} onCheckedChange={val => setDataType("address", val)} /> Address
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataTypes.payment} onCheckedChange={val => setDataType("payment", val)} /> Payment
          </Label>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Label className="flex items-center gap-2">
          <Switch checked={options.analytics} onCheckedChange={v => set("analytics", v)} />
          Analytics (Google Analytics, etc.)
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.tracking} onCheckedChange={v => set("tracking", v)} />
          Tracking/Remarketing
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.thirdParty} onCheckedChange={v => set("thirdParty", v)} />
          Third-Party Sharing
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.retention} onCheckedChange={v => set("retention", v)} />
          Data Retention Policy
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.userRights} onCheckedChange={v => set("userRights", v)} />
          User Data Rights
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.cookies} onCheckedChange={v => set("cookies", v)} />
          Cookies Usage
        </Label>
      </div>
      <div>
        <Label htmlFor="customSection" className="block mb-1 text-xs">
          Custom Section
        </Label>
        <Input
          id="customSection"
          placeholder="Write your own clause (optional)"
          value={options.customSection}
          onChange={e => set("customSection", e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
}


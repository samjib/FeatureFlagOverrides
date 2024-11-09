import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";

const AddNewFlag = ({ onAdd, onCancel }: { onAdd: () => void, onCancel: () => void }) => {
    const [flags, setFlags] = useStorage<{ [key: string]: boolean }>("featureFlags", {});
    const [newFlagName, setNewFlagName] = useState("");
    const [newFlagValue, setNewFlagValue] = useState(false);

    const handleAddFlag = () => {
        if (!newFlagName.trim()) {
            return;
        }

        if (flags[newFlagName]) {
            alert("Flag already exists.");
            return;
        }

        setFlags((prevFlags) => ({
            ...prevFlags,
            [newFlagName]: newFlagValue
        }));

        setNewFlagName("");
        setNewFlagValue(false);

        onAdd();
    }

    return (
        <div>
            <h3>Add New Flag</h3>

            <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>

                <input
                    type="text"
                    placeholder="Flag name"
                    value={newFlagName}
                    onChange={(e) => setNewFlagName(e.target.value)}
                    style={{ margin: 0, marginRight: "auto", width: "100%" }}
                />

                <select
                    value={newFlagValue ? "enabled" : "disabled"}
                    onChange={(e) => setNewFlagValue(e.target.value === "enabled")}
                >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginTop: 8, gap: 8 }}>
                <button onClick={handleAddFlag}>
                    Add Flag
                </button>
                <button onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default AddNewFlag;
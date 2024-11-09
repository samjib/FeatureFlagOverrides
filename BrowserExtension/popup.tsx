import React, { useCallback, useMemo, useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { MdAdd } from "react-icons/md";

import "style.css";
import AddNewFlag from "~components/AddNewFlag";
import Badge from "~components/Badge";

function Popup() {
  const [flags, setFlags] = useStorage<{ [key: string]: boolean }>("featureFlags", {});
  const [latestFeatureFlags] = useStorage<{ [key: string]: boolean }>("latestFeatureFlags", {});

  const [showAddFlag, setShowAddFlag] = useState(false);

  const featureFlagKeys = useMemo<string[]>(() =>
    Array.from(new Set([...Object.keys(flags), ...Object.keys(latestFeatureFlags)]))
    , [flags, latestFeatureFlags]);

  const handleChangeFeatureFlagOption = (key: string, value: "enabled" | "disabled" | "unset") => {
    if (value === "unset") {
      setFlags((prevFlags) => {
        const { [key]: _, ...rest } = prevFlags;
        return rest;
      });
      return;
    }

    setFlags((prevFlags) => ({
      ...prevFlags,
      [key]: value === "enabled"
    }));
  }

  const getBadgeForFeatureFlag = useCallback((key: string) => {
    if (flags[key] === undefined || latestFeatureFlags === undefined || Object.keys(latestFeatureFlags).length === 0) {
      return null;
    }

    if (flags[key] === latestFeatureFlags[key]) {
      return <Badge text="No Effect" type="secondary" style={{ fontSize: 12, whiteSpace: "nowrap" }} />;
    }

    if (latestFeatureFlags[key] === undefined) {
      return <Badge text="Does Not Exist" type="danger" style={{ fontSize: 12, whiteSpace: "nowrap" }} />;
    }

    return <Badge text="Overridden" type="danger" style={{ fontSize: 12, whiteSpace: "nowrap" }} />;
  }, [flags, latestFeatureFlags]);

  return (
    <div style={{ padding: 16, paddingTop: 0, width: 400 }}>
      <h2>Feature Flags</h2>

      {showAddFlag
        ? <AddNewFlag onAdd={() => setShowAddFlag(false)} onCancel={() => setShowAddFlag(false)} />
        : <div>
          <div style={{ marginBottom: 16 }}>
            {featureFlagKeys.length > 0 ? (
              featureFlagKeys.map((key) => (
                <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 8 }}>
                  <label style={{ marginRight: "auto", width: "100%" }} htmlFor={key}>
                    {key}
                  </label>

                  {getBadgeForFeatureFlag(key)}

                  <select
                    id={key}
                    value={flags[key] ? "enabled" : flags[key] === false ? "disabled" : "unset"}
                    onChange={(e) => handleChangeFeatureFlagOption(key, e.target.value as any)}
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="unset">Unset</option>
                  </select>
                </div>
              ))
            ) : (
              <p>No feature flags available.</p>
            )}
          </div>
          <button onClick={() => setShowAddFlag((prev) => !prev)} style={{ marginTop: 8 }}>
            <MdAdd style={{ marginRight: 8 }} />
            New Flag
          </button>
        </div>
      }
    </div>
  )
};

export default Popup;

const version = 1;

(async function () {
    try {
        if (window.fetch.isPatched) {
            return;
        }

        if (window.fetch.patchVersion && window.fetch.patchVersion < version) {
            console.warn('Old fetch patch version detected, removing old patch');
            window.fetch = window.fetch.original;
        }

        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            if (typeof input === 'string' && input.includes('/feature-flags')) {
                try {
                    const response = await originalFetch(input, init);
                    const data = await response.clone().json();

                    window.postMessage({ type: "latest-feature-flags-response", data }, "*");
                    window.postMessage({ type: "request-feature-flags" }, "*");

                    const retrieveFeatureFlagsPromise = new Promise((resolve) => {
                        window.addEventListener("message", function listener(event) {
                            if (event.data.type === "feature-flags") {
                                window.removeEventListener("message", listener)
                                resolve(event.data.flags)
                            }
                        });
                    });

                    const retrieveFeatureFlagsTimeoutPromise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject('Timeout')
                        }, 5000)
                    });

                    const userFeatureFlags = await Promise.race([retrieveFeatureFlagsPromise, retrieveFeatureFlagsTimeoutPromise]);

                    const modifiedData = { ...data, ...userFeatureFlags }

                    return new Response(JSON.stringify(modifiedData), {
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText
                    });
                }
                catch (error) {
                    console.error('Failed to fetch feature flags', error);
                    return originalFetch(input, init);
                }
            }

            return originalFetch(input, init);
        };

        window.fetch.isPatched = true;
        window.fetch.patchVersion = version;
        window.fetch.original = originalFetch;
    } catch (error) {
        console.error('Failed to patch fetch', error);
    }
})()

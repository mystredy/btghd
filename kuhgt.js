document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Telegram Web App SDK
    Telegram.WebApp.ready();

    // Extract tgWebAppStartParam from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppStartParam = urlParams.get('tgWebAppStartParam');

    // Check if the parameter starts with 'p_', 'b_', 'l_', or 'ref_'
    if (tgWebAppStartParam) {
        if (tgWebAppStartParam.startsWith('p_')) {
            // Handle page content replacement
            const pageName = tgWebAppStartParam.substring(2);
            const websiteURL = `/p/${pageName}.html`;

            fetch(websiteURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    document.body.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error loading the page:', error);
                    alert('Failed to load the content.');
                });

        } else if (tgWebAppStartParam.startsWith('b_')) {
            // Handle blog content replacement
            let blogPath = tgWebAppStartParam.substring(2);
            blogPath = `/${blogPath.slice(0, 4)}/${blogPath.slice(4, 6)}/${blogPath.slice(6)}`;
            const blogURL = `${blogPath}.html`;

            fetch(blogURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    document.body.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error loading the blog content:', error);
                    alert('Failed to load the blog content.');
                });

        } else if (tgWebAppStartParam.startsWith('l_')) {
            // Handle generic blog content replacement
            const pageName = tgWebAppStartParam.substring(2);
            const websiteURL = `/search/label/${pageName}`;

            fetch(websiteURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    document.body.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error loading the page:', error);
                    alert('Failed to load the content.');
                });

        } else if (tgWebAppStartParam.startsWith('ref_')) {
            // Handle referral
            const referralId = tgWebAppStartParam.substring(4);
            alert('Thank you for the referral! Your referral ID is: ' + referralId);
        }
    }
});



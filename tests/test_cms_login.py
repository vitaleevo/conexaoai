from playwright.sync_api import sync_playwright
import sys

def test_login_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # We assume the frontend is running on port 3000
        url = "http://localhost:3000/cms/login"
        print(f"Navigating to {url}...")
        
        try:
            page.goto(url)
            page.wait_for_load_state("networkidle")
            
            # Check for main elements
            title = page.locator("h2").text_content()
            print(f"Page title found: {title}")
            
            if "Backoffice Editorial" in title:
                print("SUCCESS: Login page title matches.")
            else:
                print(f"FAILURE: Unexpected title '{title}'")
                sys.exit(1)
                
            # Check for form fields
            email_input = page.locator("#email")
            password_input = page.locator("#password")
            login_button = page.locator("button[type='submit']")
            
            if email_input.is_visible() and password_input.is_visible() and login_button.is_visible():
                print("SUCCESS: All login form elements are visible.")
            else:
                print("FAILURE: Some login form elements are missing.")
                sys.exit(1)
                
            # Check for the logo mark text
            logo_text = page.locator("span.text-white").text_content()
            if "CAI" in logo_text:
                print("SUCCESS: Logo text 'CAI' found.")
            else:
                print(f"FAILURE: Logo text 'CAI' not found (found '{logo_text}')")
                sys.exit(1)
                
        except Exception as e:
            print(f"ERROR: Test failed with exception: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    test_login_page()

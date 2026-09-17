import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# I need to move the Custom Modal outside of the form!
modal_start = "{/* Custom React Modal for ABA PayWay (Fallback if script blocked) */}"
modal_end = "      </form>"

if modal_start in text and modal_end in text:
    parts = text.split(modal_start)
    before_modal = parts[0]
    modal_and_rest = parts[1]
    
    modal_parts = modal_and_rest.split(modal_end)
    modal_content = modal_parts[0]
    after_modal = modal_end + modal_parts[1]
    
    # Construct the new text: before_modal + after_modal, but put modal_content AFTER modal_end
    new_text = before_modal + modal_end + '\n' + modal_start + modal_content + after_modal.replace(modal_end, '')
    
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(new_text)
    print("Moved custom modal OUTSIDE the hidden form.")
else:
    print("Could not find modal markers.")

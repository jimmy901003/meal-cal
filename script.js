const hospital_prices = {
    "彰基": {"早餐": 300, "午餐": 450, "晚餐": 450},
    "彰化秀傳": {"早餐": 300, "午餐": 450, "晚餐": 450},
    "彰濱秀傳": {"早餐": 300, "午餐": 500, "晚餐": 500},
    "彰濱月中": {"早餐": 300, "午餐": 500, "晚餐": 500},
    "天莘診所": {"早餐": 300, "午餐": 500, "晚餐": 500},
    "蕭弘智": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "柯助伊": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "成美": {"早餐": 300, "午餐": 450, "晚餐": 450},
    "員基": {"早餐": 330, "午餐": 460, "晚餐": 460},
    "皓生": {"早餐": 300, "午餐": 450, "晚餐": 450},
    "醫院員工餐": {"早餐": 300, "午餐": 300, "晚餐": 300},
};

const our_prices = {
    "彰化足印": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "寵愛之名": {"早餐": 300, "午餐": 600, "晚餐": 600},
    "遇見好心": {"早餐": 300, "午餐": 600, "晚餐": 600},
    "龍迎新春": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "甜蜜之旅": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "彰化小金": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "調理餐": {"早餐": 300, "午餐": 650, "晚餐": 650},
    "術後餐": {"早餐": 300, "午餐": 650, "晚餐": 650},
};

function calculateCost(prices, meals) {
    return Object.entries(meals).reduce((total, [meal, quantity]) => {
        return total + prices[meal] * quantity;
    }, 0);
}

function calculateTotalCost(option, hospital, activity, hospitalMeals, ourMeals, refund, discount, deliveryChecked) {
    let total = 0;
    let originalCost = 0;

    if (option === "1" || option === "2") {
        originalCost += calculateCost(hospital_prices[hospital], hospitalMeals);
    }
    if (option === "2" || option === "3") {
        originalCost += calculateCost(our_prices[activity], ourMeals);
    }
    
    let deliveryCost = 0;
    if (deliveryChecked) {
        deliveryCost = 120;
    }
    
    total = originalCost + deliveryCost;
    total -= refund;
    total -= discount;
    
    return {
        originalCost: Math.max(originalCost, 0),
        deliveryCost: deliveryCost,
        totalCost: Math.max(total, 0)
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const optionSelect = document.getElementById('option');
    const hospitalSelect = document.getElementById('hospital');
    const activitySelect = document.getElementById('activity');
    const hospitalSelection = document.getElementById('hospitalSelection');
    const activitySelection = document.getElementById('activitySelection');
    const hospitalMeals = document.getElementById('hospitalMeals');
    const ourMeals = document.getElementById('ourMeals');
    const deliveryCheckbox = document.getElementById('delivery');
    const calculateButton = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    const deliveryCostSpan = document.getElementById('deliveryCost');

    for (let hospital in hospital_prices) {
        let option = document.createElement('option');
        option.value = option.textContent = hospital;
        hospitalSelect.appendChild(option);
    }

    for (let activity in our_prices) {
        let option = document.createElement('option');
        option.value = option.textContent = activity;
        activitySelect.appendChild(option);
    }

    optionSelect.addEventListener('change', function() {
        const selectedOption = this.value;
        hospitalSelection.style.display = selectedOption === "1" || selectedOption === "2" ? 'block' : 'none';
        activitySelection.style.display = selectedOption === "2" || selectedOption === "3" ? 'block' : 'none';
        hospitalMeals.style.display = selectedOption === "1" || selectedOption === "2" ? 'block' : 'none';
        ourMeals.style.display = selectedOption === "2" || selectedOption === "3" ? 'block' : 'none';
    });

    calculateButton.addEventListener('click', function() {
        const option = optionSelect.value;
        const hospital = hospitalSelect.value;
        const activity = activitySelect.value;
        const hospitalMealsObj = {
            "早餐": parseInt(document.getElementById('hospitalBreakfast').value) || 0,
            "午餐": parseInt(document.getElementById('hospitalLunch').value) || 0,
            "晚餐": parseInt(document.getElementById('hospitalDinner').value) || 0
        };
        const ourMealsObj = {
            "早餐": parseInt(document.getElementById('ourBreakfast').value) || 0,
            "午餐": parseInt(document.getElementById('ourLunch').value) || 0,
            "晚餐": parseInt(document.getElementById('ourDinner').value) || 0
        };
        
        const refund = parseFloat(document.getElementById('refund').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;

        const deliveryChecked = deliveryCheckbox.checked;

        const { originalCost, deliveryCost, totalCost } = calculateTotalCost(option, hospital, activity, hospitalMealsObj, ourMealsObj, refund, discount, deliveryChecked);
        
        let resultHTML = `<h3>計算結果</h3>`;
        
        resultHTML += `原始費用：${originalCost} 元<br>`;
        if (refund > 0) {
            resultHTML += `退費金額：${refund} 元<br>`;
        }
        if (discount > 0) {
            resultHTML += `折扣金額：${discount} 元<br>`;
        }
        if (deliveryChecked) {
            resultHTML += `宅配費用：${deliveryCost} 元<br>`;
        }
        resultHTML += `最終費用：<span style="color: #e74c3c; font-size: 1.2em;">${totalCost}</span> 元`;
        
        resultDiv.innerHTML = resultHTML;
        resultDiv.style.display = 'block';

        enableAllInputs();
    });

    function enableAllInputs() {
        document.querySelectorAll('input, select').forEach(input => {
            input.disabled = false;
        });
    }

    enableAllInputs();
});

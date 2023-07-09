RegisterCommand("odpalMinigre", function()
    SetNuiFocus(true, true)
    SendNUIMessage({ type = 'START_HACK' })
end)

RegisterNUICallback('win', function(data)
    SetNuiFocus(false, false)
    local win = json.decode(data.win)
    if win then
        print("Wygrales!")
    else
        print("Przegrales!")
    end
end)

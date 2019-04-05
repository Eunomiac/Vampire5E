        MarkStart('AirbagStop');
        airLog(runMsg);
    } catch (e) {
        handleCrash(e);
    }
};

codebase();
MarkStop('AirbagStop'); 
printScriptRanges();